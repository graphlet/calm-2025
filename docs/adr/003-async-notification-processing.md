# ADR 003: Asynchronous Notification Processing with Kafka Event Bus

**Status:** Accepted  
**Date:** 2025-12-30  
**Deciders:** Platform Team, Notifications Team  
**Technical Story:** High-volume notification delivery across multiple channels

## Context

The notification service needs to handle high-volume notification requests from multiple internal systems across the organization. The service must:

- **Support Multiple Delivery Channels**: Email, webhooks, and potentially SMS, push notifications, and other channels in the future
- **Handle Variable Load**: Peak loads can reach 10,000+ notifications per minute during critical system events
- **Ensure Reliability**: Notifications must be delivered even if downstream providers experience temporary failures
- **Provide Delivery Guarantees**: Critical notifications (e.g., security alerts, compliance notifications) require guaranteed delivery with retry mechanisms
- **Enable Independent Scaling**: Different notification channels have different throughput characteristics and scaling requirements
- **Maintain System Availability**: The notification API must remain responsive even when downstream delivery systems are slow or unavailable

The initial design considered synchronous processing where the API would directly invoke delivery providers, but this approach creates tight coupling and risks cascading failures.

## Decision

We will implement **asynchronous notification processing using Kafka Event Bus** with the following architecture:

### Architecture Components

1. **API Gateway** (`api-endpoint`)

   - Accepts notification requests via REST API
   - Validates requests and authenticates via Identity Provider
   - Synchronously acknowledges receipt to clients

2. **Message Processor** (`message-processor`)

   - Receives validated requests from API Gateway
   - Persists notifications to Message Store for audit trail
   - Publishes notification events to Kafka topics based on delivery channel

3. **Kafka Event Bus** (`kafka-event-bus`)

   - Provides durable message queuing with partitioning for parallel processing
   - Topics: `notification.email`, `notification.webhook`
   - Guarantees at-least-once delivery semantics
   - Enables independent consumer scaling per channel

4. **Channel-Specific Consumers**
   - Subscribe to Kafka topics for their respective channels
   - Implement retry logic with exponential backoff
   - Update delivery status in Message Store

### Processing Flow

```
Client → API Gateway → Identity Provider (auth)
                    ↓
              Message Processor → Message Store (persist)
                    ↓
              Kafka Event Bus
                    ↓
              [email-delivery-group] → Email Provider
              [webhook-delivery-group] → Webhook Target
```

### Key Design Decisions

- **Protocol**: AMQP over port 9092 for Kafka communication
- **Consumer Groups**: Separate groups per delivery channel for independent scaling
- **Retry Strategy**: Exponential backoff with dead-letter queues for permanent failures
- **Data Classification**: Internal for most notifications, confidential for sensitive data
- **SLA**: 99.95% uptime with guaranteed message delivery and ordering

## Consequences

### Positive

- **Decoupling**: API remains responsive regardless of downstream provider performance
- **Scalability**: Each delivery channel can scale independently based on load
  - Email consumers can scale to 10+ instances during peak hours
  - Webhook consumers can scale separately based on external system availability
- **Reliability**: Kafka provides durability and replication (3x) preventing message loss
- **Fault Tolerance**: Temporary provider failures don't impact API availability
- **Retry Mechanisms**: Built-in support for retries with configurable backoff strategies
- **Observability**: Kafka metrics provide visibility into processing lag and throughput
- **Extensibility**: New delivery channels can be added by creating new topics and consumers without modifying existing components
- **Ordering Guarantees**: Kafka partitions ensure ordered delivery per notification source

### Negative

- **Complexity**: Introduces additional infrastructure component (Kafka cluster)
  - Requires 3-5 broker nodes for production reliability
  - Needs dedicated operations team for cluster management
- **Latency**: Asynchronous processing adds latency between API acceptance and actual delivery
  - Typical end-to-end latency: 500ms - 2s (vs. 100-300ms for synchronous)
  - Not suitable for real-time notification requirements
- **Operational Overhead**: Requires monitoring and maintenance of Kafka cluster
  - Disk space management for topic retention
  - Consumer group rebalancing during deployments
  - Offset management and replay capabilities
- **Eventual Consistency**: Clients receive acknowledgment before delivery is complete
  - Status checks require querying Message Store
  - Webhooks may be delivered out of order if consumers restart
- **Cost**: Additional infrastructure costs for Kafka cluster (~$2000/month for production cluster)
- **Debugging Difficulty**: Distributed tracing required to follow messages through the system
- **Data Duplication**: At-least-once semantics may result in duplicate deliveries requiring idempotency in consumers

### Risks and Mitigations

| Risk                                | Impact                                | Mitigation                                                      |
| ----------------------------------- | ------------------------------------- | --------------------------------------------------------------- |
| Kafka cluster failure               | Complete notification processing halt | 3-node cluster with replication factor 3, regular backups       |
| Consumer lag during peak load       | Delayed notifications                 | Auto-scaling consumer groups, alerting on lag > 1000 messages   |
| Poison messages blocking consumers  | Channel unavailable                   | Dead-letter queues, automated message inspection and quarantine |
| Schema evolution breaking consumers | Deployment failures                   | Schema registry with backward compatibility validation          |

### Security Tradeoffs

**Advantages:**

- **Defense in Depth**: Kafka acts as security boundary between API and delivery providers
- **Audit Trail**: All messages persisted in Kafka topics provide immutable audit log
- **Access Segmentation**: Consumer groups enforce least-privilege access to topics
- **PII Isolation**: Sensitive data encrypted at rest in Kafka logs (AES-256-GCM)
- **Zero Trust**: SASL_SSL with mutual TLS between all Kafka clients and brokers

**Disadvantages:**

- **Expanded Attack Surface**: Kafka cluster introduces 5 additional broker nodes to secure
  - Mitigation: Network segmentation, private VPC, security group restrictions
- **Key Management Complexity**: Separate keystores/truststores for each consumer group
  - Mitigation: Centralized key management via AWS KMS, automated rotation
- **At-Rest Encryption Overhead**: Topic encryption adds ~10-15ms latency per message
  - Mitigation: Acceptable tradeoff for compliance requirements (GDPR, SOC2)
- **Consumer Authentication**: Each consumer group requires SASL credentials management
  - Mitigation: Integration with Identity Provider for credential lifecycle
- **Message Replay Risk**: Kafka offset manipulation could replay sensitive notifications
  - Mitigation: ACLs restrict offset management to admin roles only, audit logging enabled

**Security Requirements Introduced:**

- TLS 1.3 mandatory for all Kafka connections (no plaintext)
- SASL_SCRAM-SHA-512 for producer/consumer authentication
- Topic-level ACLs enforced for notification.email and notification.webhook
- Log encryption enabled with 7-day retention and automatic purging
- Certificate rotation every 90 days via automated pipeline

## Threat Model

### Assets

1. **Notification Messages**: User PII (email, phone), notification content
2. **Kafka Credentials**: SASL usernames/passwords, TLS certificates/keys
3. **Kafka Infrastructure**: Broker nodes, ZooKeeper ensemble, persistent volumes
4. **Message Store Database**: Historical notification records with delivery status

### Threat Actors

- **External Attackers**: Unauthorized access to notification data
- **Malicious Insiders**: Platform team members with Kafka admin access
- **Compromised Consumers**: Producer/consumer services with leaked credentials
- **Supply Chain Attacks**: Vulnerabilities in Kafka client libraries

### Threats and Mitigations

| Threat                                  | STRIDE                       | Likelihood | Impact   | Mitigation                                                                    | Residual Risk |
| --------------------------------------- | ---------------------------- | ---------- | -------- | ----------------------------------------------------------------------------- | ------------- |
| **Unauthorized topic access**           | Information Disclosure       | Medium     | High     | Topic ACLs + SASL auth + audit logging                                        | Low           |
| **Message tampering in transit**        | Tampering                    | Medium     | High     | TLS 1.3 with mutual auth, cert pinning                                        | Low           |
| **Credential theft from consumers**     | Elevation of Privilege       | Medium     | High     | Short-lived tokens, credential vault (HashiCorp), rotation every 90 days      | Medium        |
| **Kafka broker compromise**             | Tampering, Denial of Service | Low        | Critical | OS hardening, patch management, network isolation, IDS/IPS                    | Medium        |
| **Message replay attacks**              | Spoofing                     | Low        | Medium   | Idempotency tokens, consumer offset ACLs, timestamp validation                | Low           |
| **Consumer impersonation**              | Spoofing                     | Medium     | High     | Client certificate validation, service mesh identity (Istio)                  | Low           |
| **Kafka ZooKeeper compromise**          | Elevation of Privilege       | Low        | Critical | Separate ZK cluster, ACLs, no public access, encrypted comms                  | Medium        |
| **Denial of service via message flood** | Denial of Service            | Medium     | Medium   | Rate limiting at API Gateway (1000 req/user/min), Kafka quotas per producer   | Low           |
| **PII leakage in logs**                 | Information Disclosure       | High       | High     | Log masking (**_@_**.com), no PII in Kafka metrics, encrypted log storage     | Low           |
| **Backup data exfiltration**            | Information Disclosure       | Low        | High     | Encrypted backups (AWS KMS), access restricted to backup service account only | Low           |

### Security Controls by Layer

**Network Layer:**

- Private VPC with no internet-facing Kafka brokers
- Security groups: Only Message Processor → Kafka (9093), Email/Webhook Consumers → Kafka (9093)
- No SSH access to broker nodes (SSM Session Manager only)

**Authentication Layer:**

- SASL_SCRAM-SHA-512 for all producer/consumer connections
- Client certificates issued by internal CA with 90-day expiry
- Identity Provider integration for token-based consumer authentication
- Break-glass access requires incident ticket + security team approval

**Authorization Layer:**

- Topic ACLs: `message-processor` WRITE to notification.\*, consumers READ from specific topics
- Offset management restricted to admin role only
- Schema registry with RBAC for schema evolution

**Data Protection Layer:**

- TLS 1.3 in transit with approved cipher suites (TLS_AES_256_GCM_SHA384)
- AES-256-GCM at rest for Kafka logs and persistent volumes
- Field-level encryption for PII in message payloads (email, phone)
- PostgreSQL SSL verify-full mode for Message Store connections

**Monitoring & Response Layer:**

- SIEM integration for security events (failed auth, ACL violations, unusual topic access)
- Alerting on consumer lag > 1000 (potential DoS), unauthorized topic creation
- Automated response: Revoke credentials after 3 failed auth attempts
- Quarterly security audits of Kafka ACLs and consumer permissions

### Compliance Impact

- **GDPR**: Kafka retention (7 days) + right to erasure implemented via topic compaction and tombstone records
- **SOC2**: Audit logs for all topic access, annual penetration testing
- **PCI-DSS**: Not applicable (no payment card data in notifications)
- **CCPA**: Data subject access requests supported via Message Store queries

## Alternatives Considered

### 1. Synchronous Processing

- **Rejected**: API latency directly tied to slowest delivery provider, poor scalability
- **Use Case**: Only viable for low-volume (<100 notifications/min) use cases

### 2. Database-Based Queue (PostgreSQL)

- **Rejected**: Limited throughput (~1000 msg/sec), no built-in partitioning, polling overhead
- **Use Case**: Suitable for simpler systems with <5000 notifications/day

### 3. AWS SQS/SNS

- **Considered**: Lower operational overhead, fully managed
- **Rejected**: Higher per-message cost at our volume (~$5000/month vs. $2000), less control over infrastructure
- **Future Option**: May revisit for cloud-native deployment

### 4. RabbitMQ

- **Considered**: Similar features to Kafka, lower operational complexity
- **Rejected**: Lower throughput (20k msg/sec vs. Kafka's 100k+ msg/sec), less suitable for event streaming patterns

## Implementation Notes

- **Cost Center**: CC-3405 (Platform Team owns Kafka infrastructure)
- **Deployment**: Kafka cluster deployed in production environment with encryption enabled
- **Monitoring**: Datadog integration for Kafka metrics, consumer lag alerts
- **Documentation**: See [architectures/notification-service.json](../../architectures/notification-service.json) for CALM model

## References

- [Kafka Documentation](https://kafka.apache.org/documentation/)
- [Notification Service Architecture](../../architectures/notification-service.json)
- [Acme Architectural Standards](../../standards/acme-base-pattern.json)
- ADR 001: API Gateway Authentication Strategy
- ADR 002: Message Store Data Retention Policy

---

**Next Review Date:** 2026-06-30
