---
id: payment-to-external-gateway
title: Payment To External Gateway
---

## Details
<div className="table-container">
| Field               | Value                    |
|---------------------|--------------------------|
| **Unique ID**       | payment-to-external-gateway                   |
| **Description**      |  Payment Service connects to external payment provider   |
</div>

## Related Nodes
```mermaid
graph TD;
payment-service -- Connects --> external-payment-gateway;

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
                  <b>Monitoring</b>
              </td>
              <td>
                  true
                      </td>
          </tr>
          <tr>
              <td>
                  <b>Circuit Breaker</b>
              </td>
              <td>
                  true
                      </td>
          </tr>
          <tr>
              <td>
                  <b>Latency Sla</b>
              </td>
              <td>
                  &lt; 300ms
                      </td>
          </tr>
          </tbody>
      </table>
  </div>
