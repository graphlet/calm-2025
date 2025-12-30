---
id: user-registration-welcome-email-flow
title: User Registration Welcome Email
---

## Details
<div className="table-container">
| Field               | Value                    |
|---------------------|--------------------------|
| **Unique ID**       | user-registration-welcome-email-flow                   |
| **Name**            | User Registration Welcome Email                 |
| **Description**     | End-to-end flow for sending welcome email notifications when a new user registers in the system          |
</div>

## Sequence Diagram
```mermaid
sequenceDiagram
            API Gateway ->> Identity Provider: External registration system calls Notification API; API validates authentication token with Identity Provider
            API Gateway ->> Message Processor: API Gateway routes validated welcome email notification request to Message Processor
            Message Processor ->> Message Store: Message Processor persists notification record for audit trail and delivery tracking
            Message Processor ->> Kafka Event Bus: Message Processor publishes welcome email event to Kafka notification.email topic
            Kafka Event Bus ->> Email Provider: Email consumer reads event from Kafka and sends welcome email via Email Provider
            Message Processor ->> Message Store: Email consumer updates delivery status in Message Store after successful send
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
                  <b>Business Impact</b>
              </td>
              <td>
                  New users don&#x27;t receive welcome emails - poor onboarding experience
                      </td>
          </tr>
          <tr>
              <td>
                  <b>Degraded Behavior</b>
              </td>
              <td>
                  Emails queue in Kafka; delivered when service recovers
                      </td>
          </tr>
          <tr>
              <td>
                  <b>Customer Communication</b>
              </td>
              <td>
                  Welcome email will arrive shortly
                      </td>
          </tr>
          <tr>
              <td>
                  <b>Sla</b>
              </td>
              <td>
                  99.9% delivery within 30 seconds of registration
                      </td>
          </tr>
          </tbody>
      </table>
  </div>
