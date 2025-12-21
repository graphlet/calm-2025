---
id: ecommerce-platform
title: E-Commerce Platform
---

## Details
<div className="table-container">
| Field               | Value                    |
|---------------------|--------------------------|
| **Unique ID**       | ecommerce-platform                   |
| **Node Type**       | system             |
| **Name**            | E-Commerce Platform                 |
| **Description**     | Logical system containing the e-commerce services and databases          |

</div>

## Interfaces
    _No interfaces defined._


## Related Nodes
```mermaid
graph TD;
ecommerce-platform[ecommerce-platform]:::highlight;
ecommerce-platform -- Composed Of --> api-gateway;
ecommerce-platform -- Composed Of --> order-service;
ecommerce-platform -- Composed Of --> inventory-service;
ecommerce-platform -- Composed Of --> payment-service;
ecommerce-platform -- Composed Of --> order-db;
ecommerce-platform -- Composed Of --> inventory-db;
classDef highlight fill:#f2bbae;

```
## Controls
    _No controls defined._

## Metadata
  <div className="table-container">
      <table>
          <thead>
          <tr>
              <th>Key</th>
              <th>Value</th>
          </tr>
          </thead>
          <tbody>
          <tr>
              <td>
                  <b>Owner</b>
              </td>
              <td>
                  Platform Team
                      </td>
          </tr>
          </tbody>
      </table>
  </div>
