# My Advent of CALM Journey

This repository tracks my 24-day journey learning the Common Architecture Language Model (CALM).

## Progress

- [x] Day 1: Install CALM CLI and Initialize Repository
- [x] Day 2: Create Your First Node
- [x] Day 3: Connect Nodes with Relationships
- [x] Day 4: Install CALM VSCode Extension
- [x] Day 5: Add Interfaces to Nodes
- [x] Day 6: Document with Metadata
- [x] Day 7: Build Complete E-Commerce Architecture
- [x] Day 8: Add security and performance controls for NFRs
- [x] Day 9: Model order processing and inventory check flows
- [x] Day 10: Link ADRs to architecture for decision traceability.
- [x] Day 11: Generate shareable documentation website
- [x] Day 12: Create custom docs with calm-widgets
- [x] Day 13: Create custom documentation with Handlebars templates
- [x] Day 14: AI-assisted resilience improvements - LB, replicas, message queue
- [x] Day 15: Add operational metadata for support documentation
- [x] Day 16: Generate operations documentation with docify templates
- [x] Day 17: Create first CALM pattern for web applications
- [x] Day 18: Create CALM Standards for organizational node and relationship requirements
- [x] Day 19: Create Company Base Pattern to enforce Standards
- [x] Day 20: Multi-pattern validation (structure + standards)

## Architectures

This directory will contain CALM architecture files documenting systems.

## Patterns

This directory will contain CALM patterns for architectural governance.

## Multi-Pattern Validation

Structural patterns constrain topology (which nodes and relationships must exist). Standards patterns constrain properties (operational and compliance fields that every node/relationship must include).

Validate against both to ensure an architecture has the correct shape and meets company policy. Example commands:

```bash
calm validate -p patterns/web-app-pattern.json -a architectures/generated-webapp.json
calm validate -p patterns/company-base-pattern.json -a architectures/generated-webapp.json -u url-mapping.json
```

Use this approach in CI to gate merges: run structural validation first, then Standards validation (fail the build on any errors).

## Docs

Generated documentation from CALM models.

## Tools

- **CALM CLI (installed Day 1)**

  - What it's used for: generation, validation, and templates for CALM patterns and architectures.
  - Basic commands:
    - `calm generate -p <pattern-file> -o <output-file>` — generate an architecture from a pattern.
    - `calm validate -a <architecture-file>` — validate an architecture (or use `-p`/`-a` together for full validation).
    - `calm template -a <architecture> -o <output>` — render templates from an architecture.

- **CALM VSCode Extension (installed Day 4)**

  - Marketplace: https://marketplace.visualstudio.com/items?itemName=FINOS.calm-vscode-plugin
  - What it provides: visualization of architectures, tree navigation for nodes/relationships, and a live preview of architecture rendering.
  - Keyboard shortcut: `Ctrl+Shift+C` / `Cmd+Shift+C` to open the preview.

- **How they work together**
  - Use the CLI for authoritative generation and validation; use the VSCode extension for interactive visualization and editing. Validate with the CLI before committing changes and use the extension's live preview during authoring.
