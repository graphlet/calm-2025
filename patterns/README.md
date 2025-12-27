# Patterns

## What Patterns Are

CALM patterns are JSON Schema-based templates that provide a reusable architecture blueprint. Their dual superpower:

- Generation: instantiate a concrete architecture from the pattern (scaffolding).
- Validation: treat the pattern as a JSON Schema to validate architectures against the intended constraints.

## Using `web-app-pattern.json`

- Generate an architecture from the pattern:

```bash
calm generate -p patterns/web-app-pattern.json -o my-app.json
```

- Validate an architecture against the pattern:

```bash
calm validate -p patterns/web-app-pattern.json -a my-app.json
```

## What the Pattern Enforces

`patterns/web-app-pattern.json` constrains the generated/validated architecture to:

- Exactly 3 nodes (enforced via `minItems`/`maxItems` and `prefixItems`):

  - `web-frontend` — node-type: `webclient`, name: "Web Frontend"
  - `api-service` — node-type: `service`, name: "API Service"
  - `app-database` — node-type: `database`, name: "Application Database"

- Exactly 2 relationships (enforced via `minItems`/`maxItems` and `prefixItems`):
  - `frontend-to-api` — connects `web-frontend` to `api-service`
  - `api-to-database` — connects `api-service` to `app-database`

These structural identifiers (`unique-id`, `node-type`, and `name`) are defined with `const` in the pattern and must match exactly.

## What's Flexible

The pattern reserves space for operational and descriptive details that are not fixed by the pattern:

- `description` fields on nodes and relationships — you supply meaningful descriptions when instantiating.
- `interfaces` — host/port or other interface configuration may be added to nodes (for example, HTTPS interface on `api-service` or PostgreSQL on `app-database`).
- `metadata` — runtime, monitoring, owner, or environment-specific metadata can be added freely.

These flexible fields allow generated architectures to be environment- and team-specific while keeping the overall topology constrained.

## Using `company-base-pattern.json`

- Validate any architecture against company Standards:

```bash
calm validate -p patterns/company-base-pattern.json -a <architecture> -u url-mapping.json
```

## What the Pattern Enforces

`patterns/company-base-pattern.json` enforces company-wide Standards on all nodes and relationships in an architecture:

- All nodes must conform to the company node Standard (costCenter, owner, environment)
- All relationships must conform to the company relationship Standard (dataClassification, encrypted)

Unlike structural patterns, this pattern does not constrain the number, types, or connections of nodes/relationships — it only enforces property compliance.

## Difference from `web-app-pattern.json`

- **web-app-pattern.json**: Enforces specific structure (3 nodes, 2 relationships) — use for generating or validating fixed topologies
- **company-base-pattern.json**: Enforces properties (Standards) on any structure — use for compliance validation across all architectures

## When to Use Each Pattern Type

- Use `web-app-pattern.json` when you need to generate or validate a specific 3-tier web application architecture
- Use `company-base-pattern.json` when you want to ensure any architecture (regardless of structure) complies with company Standards for nodes and relationships

---

See `patterns/web-app-pattern.json` and `patterns/company-base-pattern.json` for the exact schemas and constraints.
