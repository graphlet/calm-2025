---
id: kafka-to-email-provider
title: Kafka To Email Provider
---

## Details
<div className="table-container">
| Field               | Value                    |
|---------------------|--------------------------|
| **Unique ID**       | kafka-to-email-provider                   |
| **Description**      |  Kafka consumers read email notification events and forward them to the Email Provider with automatic retry on failures   |
</div>

## Related Nodes
```mermaid
graph TD;
kafka-event-bus -- Connects --> email-provider;

```

## Controls
    _No controls defined._

## Metadata
  _No Metadata defined._
