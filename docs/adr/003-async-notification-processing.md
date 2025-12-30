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

| Risk | Impact | Mitigation |
|------|--------|------------|
| Kafka cluster failure | Complete notification processing halt | 3-node cluster with replication factor 3, regular backups |
| Consumer lag during peak load | Delayed notifications | Auto-scaling consumer groups, alerting on lag > 1000 messages |
| Poison messages blocking consumers | Channel unavailable | Dead-letter queues, automated message inspection and quarantine |
| Schema evolution breaking consumers | Deployment failures | Schema registry with backward compatibility validation |

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
