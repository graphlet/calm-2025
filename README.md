# My Advent of CALM Journey

This repository tracks my 24-day journey learning the Common Architecture Language Model (CALM).

## Progress

- [x] Day 1: Install CALM CLI and Initialize Repository
- [x] Day 2: Create Your First Node
- [x] Day 3: Connect Nodes with Relationships
- [x] Day 4: Install CALM VSCode Extension
- [x] Day 5: Add Interfaces to Nodes
...

## Architectures

This directory will contain CALM architecture files documenting systems.

## Patterns

This directory will contain CALM patterns for architectural governance.

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
