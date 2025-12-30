---
id: index
title: Welcome to CALM Documentation
sidebar_position: 1
slug: /
---

# Welcome to CALM Documentation

This documentation is generated from the **CALM Architecture-as-Code** model.

## High Level Architecture
```mermaid
C4Deployment

    Deployment_Node(deployment, "Architecture", ""){
        Container(api-endpoint, "API Gateway", "", "API Gateway that receives notification requests from external clients and internal services")
        Container(message-processor, "Message Processor", "", "Core service that processes notification messages, validates content, and routes to appropriate delivery channels")
        Container(message-store, "Message Store", "", "Persistent storage for notification history, delivery status, and audit logs")
        Container(email-provider, "Email Provider", "", "Email delivery service that sends notifications via SMTP with template rendering and tracking")
        Container(webhook-target, "Web hook", "", "Webhook dispatcher that delivers notifications to registered HTTP endpoints with retry logic")
        Container(identity-provider, "Identity Provider", "", "Authentication and authorization service that validates API requests and issues access tokens")
        Container(kafka-event-bus, "Kafka Event Bus", "", "Distributed event streaming platform that provides reliable async message delivery, retry mechanisms, and event ordering for notification processing")
    }

    Rel(api-endpoint,identity-provider,"Connects To")
    Rel(api-endpoint,message-processor,"Connects To")
    Rel(message-processor,message-store,"Connects To")
    Rel(message-processor,kafka-event-bus,"Connects To")
    Rel(kafka-event-bus,email-provider,"Connects To")
    Rel(kafka-event-bus,webhook-target,"Connects To")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="2")
```
## Nodes
    - [API Gateway](nodes/api-endpoint)
    - [Message Processor](nodes/message-processor)
    - [Message Store](nodes/message-store)
    - [Email Provider](nodes/email-provider)
    - [Web hook](nodes/webhook-target)
    - [Identity Provider](nodes/identity-provider)
    - [Kafka Event Bus](nodes/kafka-event-bus)

## Relationships
    - [Api To Identity Provider](relationships/api-to-identity-provider)
    - [Api To Processor](relationships/api-to-processor)
    - [Processor To Message Store](relationships/processor-to-message-store)
    - [Processor To Kafka](relationships/processor-to-kafka)
    - [Kafka To Email Provider](relationships/kafka-to-email-provider)
    - [Kafka To Webhook Target](relationships/kafka-to-webhook-target)


## Flows
    - [User Registration Welcome Email](flows/user-registration-welcome-email-flow)

## Controls
  _No Controls defined._

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
                  john@architecthub.com
                      </td>
          </tr>
          <tr>
              <td>
                  <b>Version</b>
              </td>
              <td>
                  1.0.0
                      </td>
          </tr>
          <tr>
              <td>
                  <b>Created</b>
              </td>
              <td>
                  2025-12-30
                      </td>
          </tr>
          <tr>
              <td>
                  <b>Tags</b>
              </td>
              <td>
                  <ul>
                      <li>notifications</li>
                      <li>microservices</li>
                  </ul>
              </td>
          </tr>
          <tr>
              <td>
                  <b>RunbookUrl</b>
              </td>
              <td>
                  https://wiki.acme.corp/runbooks/notification-service
                      </td>
          </tr>
          <tr>
              <td>
                  <b>MonitoringDashboardUrl</b>
              </td>
              <td>
                  https://datadog.acme.corp/dashboard/notification-service
                      </td>
          </tr>
          <tr>
              <td>
                  <b>OncallRotation</b>
              </td>
              <td>
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
                                  <b>Primary</b>
                              </td>
                              <td>
                                  notifications-team
                                      </td>
                          </tr>
                          <tr>
                              <td>
                                  <b>Secondary</b>
                              </td>
                              <td>
                                  platform-team
                                      </td>
                          </tr>
                          <tr>
                              <td>
                                  <b>ScheduleUrl</b>
                              </td>
                              <td>
                                  https://pagerduty.acme.corp/schedules/notification-service
                                      </td>
                          </tr>
                          <tr>
                              <td>
                                  <b>EscalationPolicy</b>
                              </td>
                              <td>
                                  https://pagerduty.acme.corp/escalation-policies/notifications
                                      </td>
                          </tr>
                          </tbody>
                      </table>
                  </div>
              </td>
          </tr>
          </tbody>
      </table>
  </div>

## Adrs
  _No Adrs defined._
