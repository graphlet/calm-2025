---
id: kafka-to-webhook-target
title: Kafka To Webhook Target
---

## Details
<div className="table-container">
| Field               | Value                    |
|---------------------|--------------------------|
| **Unique ID**       | kafka-to-webhook-target                   |
| **Description**      |  Kafka consumers read webhook notification events and deliver them to external webhook targets with exponential backoff retry strategy   |
</div>

## Related Nodes
```mermaid
graph TD;
kafka-event-bus -- Connects --> webhook-target;

```

## Controls
    _No controls defined._

## Metadata
  _No Metadata defined._
