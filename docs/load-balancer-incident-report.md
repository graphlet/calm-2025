# Incident Summary: Load Balancer Health Check Misconfiguration

**Incident ID:** INC-2025-12-27-001  
**Date:** 27 December 2025  
**Duration:** ~10 minutes (from initial errors to resolution)  
**Root Cause:** Load balancer health check misconfiguration caused API Gateway 2 to be incorrectly marked as unhealthy, directing all traffic to API Gateway 1, which became overloaded and failed.

## 1. Affected Services and Their Tiers

Based on the e-commerce platform architecture:

**Tier 1 (Critical Services - Direct Revenue Impact):**
- Load Balancer (entry point, tier-1)
- API Gateway 1 (overloaded, tier-1)
- API Gateway 2 (marked unhealthy, tier-1)
- Order Service (tier-1)
- Payment Service (tier-1, indirectly affected via order flow)

**Tier 2 (Supporting Services):**
- Inventory Service (tier-2)

**Infrastructure:**
- Order Database Primary/Replica (tier-1)
- Inventory Database (tier-2)
- Message Broker (RabbitMQ, managed)

## 2. Business Flows Impacted

From the architecture's flow definitions:

- **Order Processing Flow** (`order-processing-flow`): End-to-end customer order creation and payment processing
- **Inventory Check Flow** (`inventory-check-flow`): Admin inventory stock level checks and updates

## 3. Customer Impact Based on Flow Metadata

**Order Processing Flow:**
- **Business Impact:** "Customers cannot complete purchases - direct revenue loss"
- **Customer Communication:** "Display 'Order processing delayed' message"
- **Degraded Behavior:** "Orders queue in message broker; processed when service recovers"
- **SLA:** "99.9% availability, 30s p99 latency"

**Inventory Check Flow:**
- **Business Impact:** "Stock levels may be inaccurate - risk of overselling"
- **Customer Communication:** "Display 'Stock availability being confirmed'"
- **Degraded Behavior:** "Fall back to cached inventory; flag orders for manual review"
- **SLA:** "99.5% availability, 500ms p99 latency"

**Overall Customer Impact:** Checkout failures, delayed order processing, potential cart abandonment, and risk of overselling inventory during the outage window.

## 4. Timeline of Dependency Failures

**T-10 minutes (Start of Incident):**
- Load balancer health check misconfiguration takes effect
- API Gateway 2 marked as unhealthy due to incorrect health check parameters

**T-9 minutes:**
- All traffic redirected to API Gateway 1
- API Gateway 1 experiences immediate load spike (100% traffic increase)

**T-7 minutes:**
- API Gateway 1 becomes overloaded, starts returning 5xx errors
- Downstream services (Order Service, Inventory Service) begin experiencing timeouts

**T-5 minutes:**
- Order Service errors increase: database connection pool exhaustion, payment service circuit breaker triggers
- Inventory Service errors: database timeouts, stale cache data
- Message broker queue depth increases as async processing backs up

**T-2 minutes:**
- Full cascade: Payment Service affected via order queue backlogs
- Customer-facing errors: checkout failures, inventory validation issues

**T+0 (Resolution):**
- Load balancer configuration corrected
- API Gateway 2 health check passes, traffic redistributes
- Services recover within 2-3 minutes

## 5. Remediation Steps Taken

1. **Identified Root Cause:** Reviewed load balancer configuration and confirmed health check endpoint mismatch for API Gateway 2
2. **Fixed Configuration:** Updated load balancer health check to use correct `/actuator/health` endpoint with proper timeout and interval settings
3. **Restored Redundancy:** API Gateway 2 came back online, redistributing traffic (50/50 split)
4. **Monitored Recovery:** Verified service health endpoints and Grafana dashboards showed normal metrics within 5 minutes
5. **Validated Flows:** Confirmed order processing and inventory checks resumed normal operation

## 6. Follow-up Actions to Prevent Recurrence

1. **Configuration Review:** Audit all load balancer and API Gateway health check configurations across environments
2. **Monitoring Enhancements:** Add alerts for uneven traffic distribution (>70% on single instance) and health check failures
3. **Testing Improvements:** Implement automated failover testing in CI/CD pipeline and quarterly disaster recovery drills
4. **Runbook Updates:** Update incident response runbooks with specific load balancer troubleshooting steps
5. **Capacity Planning:** Review auto-scaling policies for API Gateway instances to handle sudden traffic shifts
6. **Post-Mortem Review:** Schedule retrospective meeting with platform-team, orders-team, and inventory-team to identify additional safeguards

**Lessons Learned:** The shared API Gateway dependency created a single point of failure despite redundancy. Consider implementing more granular health checks and circuit breakers at the load balancer level.
