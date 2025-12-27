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

---

See `patterns/web-app-pattern.json` for the exact schema and constraints.
