# On-Call Quick Reference

**Architecture:** 
**Generated:** 

## Service Contacts

| Service | Owner | On-Call Channel | Tier |
|---------|-------|-----------------|------|
| API Gateway 1 | platform-team | #oncall-platform | tier-1 |
| API Gateway 2 | platform-team | #oncall-platform | tier-1 |
| Load Balancer | platform-team | #oncall-platform | tier-1 |
| Order Service | orders-team | #oncall-orders | tier-1 |
| Inventory Service | inventory-team | #oncall-inventory | tier-2 |
| Payment Service | payments-team | #oncall-payments | tier-1 |

## Database Contacts

| Database | DBA Contact | Backup Schedule | Restore Time |
|----------|-------------|-----------------|--------------|
| Order Database Primary | dba@example.com | daily at 02:00 UTC | 4 hours |
| Order Database Replica | dba@example.com | N/A (replica) | 2 hours (from primary) |
| Inventory Database | dba@example.com | daily at 03:00 UTC | 2 hours |

## Critical Flows & Business Impact

### Customer Order Processing

- **Business Impact:** Customers cannot complete purchases - direct revenue loss
- **SLA:** 99.9% availability, 30s p99 latency
- **Degraded Behavior:** Orders queue in message broker; processed when service recovers
- **Customer Communication:** Display &#x27;Order processing delayed&#x27; message

**Flow Path:**
0. customer-interacts-gateway
1. gateway-to-order
2. order-publishes-to-order-queue
3. order-queue-to-payment

---

### Inventory Stock Check

- **Business Impact:** Stock levels may be inaccurate - risk of overselling
- **SLA:** 99.5% availability, 500ms p99 latency
- **Degraded Behavior:** Fall back to cached inventory; flag orders for manual review
- **Customer Communication:** Display &#x27;Stock availability being confirmed&#x27;

**Flow Path:**
0. admin-interacts-gateway
1. gateway-to-inventory
2. inventory-to-inventorydb
3. inventory-to-inventorydb
4. gateway-to-inventory

---


## Monitoring Links

| Resource | Link |
|----------|------|
| Grafana Dashboard | https://grafana.example.com/d/ecommerce-overview |
| Kibana Logs | https://kibana.example.com/app/discover#/ecommerce-* |
| PagerDuty | https://pagerduty.example.com/services/ECOMMERCE |
| Status Page | https://status.example.com |

## Escalation Matrix

| Tier | Response Time | Escalation Path |
|------|---------------|-----------------|
| tier-1 | 15 minutes | Page immediately, all-hands |
| tier-2 | 30 minutes | Page on-call, notify manager |
| tier-3 | 2 hours | Slack notification, next business day OK |