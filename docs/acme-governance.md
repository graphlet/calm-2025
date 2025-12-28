# Acme Architecture Governance Guide

This guide explains how to use Acme's CALM standards and patterns to ensure architectural compliance.

## Overview

Acme uses a **multi-pattern validation approach** that separates:

- **Standards** — required properties for FinOps, incident response, security, and operational excellence
- **Structural Patterns** — domain-specific architectural requirements (e.g., notification services, web apps)

This separation enables:
- **Reusability**: Same standards apply across all architecture types
- **Clarity**: Structural and compliance failures are diagnosed separately
- **Flexibility**: Teams can create new structural patterns while maintaining consistent standards

---

## Acme Standards

### Node Standard (`standards/acme-node-standard.json`)

All nodes in your architectures must include these properties:

#### Required Properties (Production)

For `environment: production`, all of the following are **required**:

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `costCenter` | string | Cost center code (format: `CC-XXXX`) | `"CC-2001"` |
| `owner` | string | Team or individual responsible | `"platform-team"` |
| `ownerContact` | email | Email for escalations | `"platform@acme.com"` |
| `environment` | enum | Deployment environment | `"production"` |
| `dataSensitivity` | enum | Data classification level | `"internal"` |

**Environment values**: `development`, `staging`, `qa`, `production`, `sandbox`

**Data sensitivity values**: `public`, `internal`, `confidential`, `restricted`

#### Required Properties (Non-Production)

For non-production environments (`development`, `staging`, `qa`, `sandbox`), only these are **required**:

- `costCenter`
- `owner`

This conditional enforcement reduces friction for development environments while maintaining accountability.

#### Optional Properties

These properties are recommended but not required:

| Property | Type | Description |
|----------|------|-------------|
| `slaTier` | string | Service tier (e.g., `"tier-1"`, `"tier-2"`) |
| `backupPolicy` | string | Backup requirements and RTO |
| `deploymentType` | string | Deployment model (e.g., `"container"`, `"managed-service"`) |
| `runbook` | URI | Link to operational runbook |
| `monitoringDashboard` | URI | Link to Grafana/observability dashboard |
| `oncallChannel` | string | Slack channel for incidents (e.g., `"#oncall-platform"`) |
| `pagerDutyService` | URI | PagerDuty service link |

### Relationship Standard (`standards/acme-relationship-standard.json`)

All relationships (connections between nodes) must include:

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `encrypted` | boolean | Is data encrypted in transit? | `true` |
| `dataClassification` | enum | Data sensitivity level | `"internal"` |
| `sla` | string | Expected SLA/SLO | `"99.9% within 100ms"` |
| `mode` | enum | Communication mode | `"synchronous"` |

**Data classification values**: `public`, `internal`, `confidential`, `restricted`

**Mode values**: `synchronous`, `asynchronous`

---

## Patterns

### Acme Base Pattern (`patterns/acme-base-pattern.json`)

**Purpose**: Universal standards enforcement without structural constraints.

This pattern validates that **all nodes and relationships** comply with Acme standards, regardless of architecture type.

**What it enforces**:
- Every node has required Acme properties (conditional based on environment)
- Every relationship has required Acme properties
- No structural constraints (doesn't dictate which nodes or connections must exist)

**When to use**: Validate any architecture for standards compliance.

### Notification Service Pattern (`patterns/notification-service-pattern.json`)

**Purpose**: Domain-specific pattern for notification service architectures.

**What it enforces**:

1. **Service Node Requirements**
   - Must contain at least one `service` node with name matching `"notification"`
   - All nodes must comply with Acme node standard

2. **Interface Requirements**
   - Must have an HTTP interface with `unique-id` matching pattern `(ingest|api|api-gateway)`
   - Interface type must be `"http"`

3. **Metadata Requirements**
   - **supportedChannels** (array, min 2 items):
     - Must include `"email"` and `"webhook"`
     - Valid channels: `email`, `sms`, `push`, `webhook`, `slack`
   - **templates** (URI): Location of notification templates
   - **messageStore** (object):
     - `uri` (required): Storage location for notification history
     - `retentionPolicy` (optional): Retention duration
   - **Must have EITHER**:
     - `queue` (string): Queue name for async processing, OR
     - `processing` (object): Worker pool configuration

4. **Optional Metadata**
   - `defaultRetryPolicy`: Retry strategy
   - `slo`: Service level objective
   - `processing.workers`: Number of worker processes
   - `processing.concurrency`: Concurrent message processing
   - `processing.dlq`: Dead letter queue name
   - `processing.idempotencyKey`: Field for idempotency checks
   - `processing.backoffPolicy`: Backoff strategy
   - `adapters`: Array of delivery channel providers

**When to use**: Validate notification service architectures for structural and operational requirements.

---

## Validation Workflow

### Step 1: Core CALM Schema Validation

Validate that your architecture is well-formed CALM:

```bash
calm validate -a architectures/<your-architecture>.json
```

This checks:
- Valid JSON syntax
- Required CALM properties (unique-id, node-type, name, description, etc.)
- Interface definitions are correct
- Relationship structure is valid

### Step 2: Standards Validation

Validate that your architecture complies with Acme standards:

```bash
calm validate \
  -p patterns/acme-base-pattern.json \
  -a architectures/<your-architecture>.json \
  -u url-mapping.json
```

**The `-u url-mapping.json` flag** is required to resolve local standard URLs.

This checks:
- All nodes have required Acme properties (based on environment)
- All relationships have required Acme properties
- Property values match expected formats and enums

**Common validation errors**:
- Missing `costCenter` or `owner` on nodes
- Missing `encrypted` or `mode` on relationships
- Invalid `environment` value (must be from allowed enum)
- Production nodes missing `ownerContact`, `environment`, or `dataSensitivity`

### Step 3: Structural Pattern Validation (Optional)

If your architecture follows a specific structural pattern (e.g., notification service), validate it:

```bash
calm validate \
  -p patterns/notification-service-pattern.json \
  -a architectures/<your-architecture>.json \
  -u url-mapping.json
```

This checks:
- Required nodes exist with correct types and names
- Required interfaces are present
- Required metadata is defined
- Domain-specific constraints are met

### Multi-Pattern Validation in CI/CD

For comprehensive governance, run both validations in your CI pipeline:

```bash
#!/bin/bash
set -e

ARCHITECTURE="architectures/my-service.json"

echo "→ Validating CALM schema..."
calm validate -a "$ARCHITECTURE"

echo "→ Validating Acme standards compliance..."
calm validate \
  -p patterns/acme-base-pattern.json \
  -a "$ARCHITECTURE" \
  -u url-mapping.json

echo "→ Validating notification service pattern..."
calm validate \
  -p patterns/notification-service-pattern.json \
  -a "$ARCHITECTURE" \
  -u url-mapping.json

echo "✅ All validations passed"
```

**Pipeline recommendations**:
1. Run validations on every pull request
2. Fail builds if any validation errors occur
3. Surface validation errors as PR comments for developer visibility
4. Gate production deployments on successful validation

---

## Examples

### Valid Node (Production)

```json
{
  "unique-id": "payment-service",
  "node-type": "service",
  "name": "Payment Service",
  "description": "Processes payment transactions",
  "costCenter": "CC-1001",
  "owner": "payments-team",
  "ownerContact": "payments@acme.com",
  "environment": "production",
  "dataSensitivity": "confidential",
  "slaTier": "tier-1",
  "runbook": "https://wiki.acme.com/runbooks/payment-service",
  "monitoringDashboard": "https://grafana.acme.com/d/payments"
}
```

### Valid Node (Development)

```json
{
  "unique-id": "test-service",
  "node-type": "service",
  "name": "Test Service",
  "description": "Test service for experimentation",
  "costCenter": "CC-9999",
  "owner": "dev-team",
  "environment": "development",
  "dataSensitivity": "public"
}
```

Note: Non-production nodes only require `costCenter` and `owner`.

### Valid Relationship

```json
{
  "unique-id": "api-to-db",
  "description": "API service queries database",
  "relationship-type": {
    "connects": {
      "source": { "node": "api-service" },
      "destination": { "node": "database" }
    }
  },
  "encrypted": true,
  "dataClassification": "confidential",
  "sla": "99.9% within 50ms",
  "mode": "synchronous"
}
```

### Reference Architecture

See `architectures/compliant-acme-notification-test-service.json` for a fully compliant notification service architecture demonstrating:
- All required Acme properties on nodes and relationships
- Notification service pattern requirements
- Multi-channel delivery configuration
- Message store and queue metadata

---

## Troubleshooting

### Error: "must have required property 'costCenter'"

**Cause**: Node is missing the `costCenter` property.

**Solution**: Add cost center to the node:
```json
{
  "unique-id": "my-service",
  "costCenter": "CC-1234",
  ...
}
```

### Error: "must match pattern '^CC-[0-9]{4}$'"

**Cause**: Cost center format is invalid.

**Solution**: Use format `CC-XXXX` where X is a digit:
```json
"costCenter": "CC-2001"  // ✓ Valid
"costCenter": "cc-2001"  // ✗ Invalid (lowercase)
"costCenter": "CC-200"   // ✗ Invalid (3 digits)
"costCenter": "2001"     // ✗ Invalid (missing CC- prefix)
```

### Error: "must be equal to one of the allowed values"

**Cause**: Property value doesn't match the enum constraint.

**Solution**: Check the allowed values for that property:
- `environment`: `development`, `staging`, `qa`, `production`, `sandbox`
- `dataSensitivity`: `public`, `internal`, `confidential`, `restricted`
- `dataClassification` (relationships): `public`, `internal`, `confidential`, `restricted`
- `mode` (relationships): `synchronous`, `asynchronous`

### Error: "must contain at least 1 valid item(s)" (notification pattern)

**Cause**: Missing required node or interface in notification service architecture.

**Solution**: Ensure your architecture has:
1. A service node with name containing `"notification"`
2. An HTTP interface with `unique-id` matching `(ingest|api|api-gateway)`
3. Required metadata: `supportedChannels`, `templates`, `messageStore`

### Error: "unknown format 'email' ignored"

**Cause**: Warning (not an error) - JSON Schema validator doesn't recognize the `email` format.

**Impact**: None. This is informational only and doesn't cause validation to fail.

---

## Best Practices

### 1. Start with Core Validation

Always validate basic CALM schema first before running pattern validations:
```bash
calm validate -a architectures/my-arch.json
```

### 2. Use URL Mapping for Local Development

Keep a `url-mapping.json` at the repository root to resolve standard URLs locally:
```json
{
  "https://example.com/standards/acme-node-standard.json": "standards/acme-node-standard.json",
  "https://example.com/standards/acme-relationship-standard.json": "standards/acme-relationship-standard.json"
}
```

### 3. Validate Early and Often

Run validation:
- Before committing code (git pre-commit hook)
- In pull request CI checks
- Before deployment

### 4. Document Exceptions

If a service can't meet certain standards (e.g., vendor-managed service without cost center), document the exception in the architecture's `description` or `metadata` fields.

### 5. Keep Standards Stable

Standards changes affect all architectures. Use versioning and deprecation periods when updating standards.

### 6. Create Domain-Specific Patterns

For common architectural patterns in your organization (microservices, data pipelines, ML workflows), create structural patterns like `notification-service-pattern.json`.

---

## Getting Help

- **Standards issues**: Contact #architecture-governance
- **Pattern validation failures**: Contact #calm-help
- **CI/CD integration**: See internal wiki: Architecture Validation in CI
- **Reference implementations**: Check `architectures/compliant-acme-*.json` examples

---

## Summary

| Validation Type | Command | What It Checks |
|----------------|---------|----------------|
| **Core CALM** | `calm validate -a <arch>` | Valid CALM JSON structure |
| **Standards** | `calm validate -p patterns/acme-base-pattern.json -a <arch> -u url-mapping.json` | Required Acme properties on all nodes/relationships |
| **Structural** | `calm validate -p patterns/<pattern>.json -a <arch> -u url-mapping.json` | Domain-specific architectural requirements |

**Required for all architectures**: Core CALM + Standards validation

**Optional**: Structural pattern validation (if applicable)

