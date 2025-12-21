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
        Person(customer, "Customer", "End customer who places orders via the storefront")
        Person(admin, "Administrator", "Platform administrator who manages orders and inventory")
        Deployment_Node(ecommerce-platform, "E-Commerce Platform", "Logical system containing the e-commerce services and databases"){
            Container(api-gateway, "API Gateway", "", "Public API gateway that routes requests to backend services")
            Container(order-service, "Order Service", "", "Handles order creation, updates and queries")
            Container(inventory-service, "Inventory Service", "", "Maintains product inventory and availability")
            Container(payment-service, "Payment Service", "", "Processes payments with external payment gateways")
            Container(order-db, "Order Database", "", "Primary store for order data")
            Container(inventory-db, "Inventory Database", "", "Stores inventory and stock levels")
        }
        Container(external-payment-gateway, "External Payment Provider", "", "Third-party payment gateway used to process customer payments")
    }

    Rel(customer,api-gateway,"Interacts With")
    Rel(admin,api-gateway,"Interacts With")
    Rel(api-gateway,order-service,"Connects To")
    Rel(api-gateway,inventory-service,"Connects To")
    Rel(order-service,order-db,"Connects To")
    Rel(order-service,payment-service,"Connects To")
    Rel(inventory-service,inventory-db,"Connects To")
    Rel(payment-service,external-payment-gateway,"Connects To")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="2")
```
## Nodes
    - [Customer](nodes/customer)
    - [Administrator](nodes/admin)
    - [API Gateway](nodes/api-gateway)
    - [Order Service](nodes/order-service)
    - [Inventory Service](nodes/inventory-service)
    - [Payment Service](nodes/payment-service)
    - [Order Database](nodes/order-db)
    - [Inventory Database](nodes/inventory-db)
    - [E-Commerce Platform](nodes/ecommerce-platform)
    - [External Payment Provider](nodes/external-payment-gateway)

## Relationships
    - [Customer Interacts Gateway](relationships/customer-interacts-gateway)
    - [Admin Interacts Gateway](relationships/admin-interacts-gateway)
    - [Gateway To Order](relationships/gateway-to-order)
    - [Gateway To Inventory](relationships/gateway-to-inventory)
    - [Order To Orderdb](relationships/order-to-orderdb)
    - [Order To Payment](relationships/order-to-payment)
    - [Inventory To Inventorydb](relationships/inventory-to-inventorydb)
    - [Platform Composed Of](relationships/platform-composed-of)
    - [Payment To External Gateway](relationships/payment-to-external-gateway)


## Flows
    - [Customer Order Processing](flows/order-processing-flow)
    - [Inventory Stock Check](flows/inventory-check-flow)

## Controls
| Requirement URL               | Category    | Scope        | Applied To                |
|-------------------------------|-----------|--------------|---------------------------|
|https://internal-policy.example.com/performance/rate-limiting|performance|Node|api-gateway|
|https://www.pcisecuritystandards.org/documents/PCI-DSS-v4.0|compliance|Node|payment-service|
|https://internal-policy.example.com/audit/transaction-logging|audit|Flow|order-processing-flow|

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
                  graphlet@gmail.com
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
                  2025-12-20
                      </td>
          </tr>
          <tr>
              <td>
                  <b>Description</b>
              </td>
              <td>
                  E-commerce order processing platform
                      </td>
          </tr>
          <tr>
              <td>
                  <b>Tags</b>
              </td>
              <td>
                  <ul>
                      <li>ecommerce</li>
                      <li>microservices</li>
                      <li>orders</li>
                  </ul>
              </td>
          </tr>
          </tbody>
      </table>
  </div>

## Adrs
- [docs/adr/0001-use-message-queue-for-async-processing.md](docs/adr/0001-use-message-queue-for-async-processing.md)
- [docs/adr/0002-use-oauth2-for-api-authentication.md](docs/adr/0002-use-oauth2-for-api-authentication.md)
