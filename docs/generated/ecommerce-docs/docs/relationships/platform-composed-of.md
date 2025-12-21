---
id: platform-composed-of
title: Platform Composed Of
---

## Details
<div className="table-container">
| Field               | Value                    |
|---------------------|--------------------------|
| **Unique ID**       | platform-composed-of                   |
| **Description**      |  E-Commerce Platform contains all services and databases   |
</div>

## Related Nodes
```mermaid
graph TD;
ecommerce-platform -- Composed Of --> api-gateway;
ecommerce-platform -- Composed Of --> order-service;
ecommerce-platform -- Composed Of --> inventory-service;
ecommerce-platform -- Composed Of --> payment-service;
ecommerce-platform -- Composed Of --> order-db;
ecommerce-platform -- Composed Of --> inventory-db;

```

## Controls
    _No controls defined._

## Metadata
  _No Metadata defined._
