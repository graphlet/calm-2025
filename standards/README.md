# Standards

## What Standards Are

CALM Standards are JSON Schema documents that extend core CALM definitions to add organisation- or domain-specific constraints and properties. Standards are composed with core CALM schemas using `allOf` so they inherit the base structure while adding additional properties, validation rules, and documentation.

Using `allOf` means a Standard effectively says: "this document must satisfy the core CALM schema AND these extra rules" — enabling both strong validation and reusability across architectures and patterns.

## Our Company Node Standard

File: `standards/company-node-standard.json`

This standard extends the CALM core `node` definition and adds operational properties required by our organisation:

- `costCenter` (required): string matching the pattern `CC-XXXX` where `XXXX` are digits. Example: `CC-1234`.
  - Description: Company cost center code used for billing and chargeback.
- `owner` (required): string identifying the team or individual responsible for the node.
  - Description: Business or technical owner for escalations and maintenance.
- `environment` (optional): must be one of `development`, `staging`, or `production`.
  - Description: Deployment environment for the node.

The Standard is implemented by composing the core CALM node schema with an additional object that defines these properties and marks `costCenter` and `owner` as required.

Note: the Acme node Standard applies stricter validation for `production` nodes. When `environment` is set to `production` the schema requires the full set of operational properties (`costCenter`, `owner`, `ownerContact`, `environment`, and `dataSensitivity`). For non-production environments the baseline required fields are `costCenter` and `owner` to reduce developer friction during onboarding. Use CI gating to enforce production-only failures and surface warnings for non-production placeholders.

## Our Company Relationship Standard

File: `standards/company-relationship-standard.json`

This standard extends the CALM core `relationship` definition and adds connection-level operational properties:

- `dataClassification` (required): one of `public`, `internal`, `confidential`, `restricted`.
  - Description: Classification of the data transmitted across the relationship; used to drive encryption, logging, and access controls.
- `encrypted` (required): boolean.
  - Description: Indicates whether the communication over this relationship is encrypted (for example TLS or mTLS).

As with the node standard, this relationship standard uses `allOf` to combine the base relationship schema with the company-specific requirements so that any relationship validated against the standard must include the classification and encryption properties.

---

See the two standard files under `standards/` for exact schemas and for use with `calm validate` when composing patterns or architectures.
