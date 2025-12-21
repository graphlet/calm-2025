---
architecture: ../architectures/ecommerce-platform.json
---
# Node Inventory: E-commerce order processing platform

| Name | Type | ID | Description |
|------|------|-------|-------------|
| Customer | Actor | `customer` | End customer who places orders via the storefront |
| Administrator | Actor | `admin` | Platform administrator who manages orders and inventory |
| API Gateway | Service | `api-gateway` | Public API gateway that routes requests to backend services |
| Order Service | Service | `order-service` | Handles order creation, updates and queries |
| Inventory Service | Service | `inventory-service` | Maintains product inventory and availability |
| Payment Service | Service | `payment-service` | Processes payments with external payment gateways |
| Order Database | Database | `order-db` | Primary store for order data |
| Inventory Database | Database | `inventory-db` | Stores inventory and stock levels |
| E-Commerce Platform | System | `ecommerce-platform` | Logical system containing the e-commerce services and databases |
| External Payment Provider | System | `external-payment-gateway` | Third-party payment gateway used to process customer payments |

## Services Only

- **API Gateway** (`api-gateway`): Public API gateway that routes requests to backend services
- **Order Service** (`order-service`): Handles order creation, updates and queries
- **Inventory Service** (`inventory-service`): Maintains product inventory and availability
- **Payment Service** (`payment-service`): Processes payments with external payment gateways

## Databases Only

- **Order Database** (`order-db`): Primary store for order data
- **Inventory Database** (`inventory-db`): Stores inventory and stock levels

## Actors

- **Customer**: End customer who places orders via the storefront
- **Administrator**: Platform administrator who manages orders and inventory
