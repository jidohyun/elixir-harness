# Overview

`elixir-harness` installs a repo-local `.code_my_spec/` directory for AI-assisted Elixir/Phoenix development.

It is designed to make agents read project context before editing code:

```text
architecture → status → spec → rules → issues → implementation → QA
```

## What it gives you

- Architecture map and dependency graph
- Component implementation/test status
- Spec templates for contexts, repositories, and LiveViews
- Rules for Phoenix/LiveView/Ecto development
- QA plan and journey plan templates
- A reproducible task entrypoint

## What it does not do

- It does not generate a Phoenix app.
- It does not modify application code.
- It does not add Elixir dependencies.
- It does not collect telemetry.

## Main entrypoint

After installation, read:

```bash
.code_my_spec/AGENTS.md
```
