---
architecture: ../architectures/ecommerce-platform.json
---
# Relationship Details: E-commerce order processing platform

### customer-interacts-gateway


**Type:** Interaction

- **Actor:** `customer`
- **Interacts with:** `api-gateway`


---
### admin-interacts-gateway


**Type:** Interaction

- **Actor:** `admin`
- **Interacts with:** `api-gateway`


---
### gateway-to-order

**Type:** Connection

| Property | Value |
|----------|-------|
| Source | `api-gateway` |
| Destination | `order-service` |
| Source Interfaces | `api-gateway-http` |
| Dest Interfaces | `order-service-http` |



---
### gateway-to-inventory

**Type:** Connection

| Property | Value |
|----------|-------|
| Source | `api-gateway` |
| Destination | `inventory-service` |
| Source Interfaces | `api-gateway-http` |
| Dest Interfaces | `inventory-service-http` |



---
### order-to-orderdb

**Type:** Connection

| Property | Value |
|----------|-------|
| Source | `order-service` |
| Destination | `order-db` |
| Source Interfaces | `order-service-http` |
| Dest Interfaces | `order-db-jdbc` |



---
### order-to-payment

**Type:** Connection

| Property | Value |
|----------|-------|
| Source | `order-service` |
| Destination | `payment-service` |
| Source Interfaces | `order-service-http` |
| Dest Interfaces | `payment-service-http` |



---
### inventory-to-inventorydb

**Type:** Connection

| Property | Value |
|----------|-------|
| Source | `inventory-service` |
| Destination | `inventory-db` |
| Source Interfaces | `inventory-service-http` |
| Dest Interfaces | `inventory-db-jdbc` |



---
### platform-composed-of



**Type:** Composition

- **Container:** `ecommerce-platform`
- **Contains:** `api-gateway`, `order-service`, `inventory-service`, `payment-service`, `order-db`, `inventory-db`

---
### payment-to-external-gateway

**Type:** Connection

| Property | Value |
|----------|-------|
| Source | `payment-service` |
| Destination | `external-payment-gateway` |
| Source Interfaces | `payment-service-http` |
| Dest Interfaces | `external-payment-api` |



---
