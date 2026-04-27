---
component_type: context
session_type: design
---

# Context Design Rules

## Scope-First Security

- Public functions that cross user/account/project boundaries must accept a scope/current-user struct as the first parameter.
- Database queries must filter by scope foreign keys where applicable.
- Do not let LiveViews or controllers bypass context authorization by calling repositories directly.

## API Design

- Functions should be self-documenting through clear naming.
- Return consistent tuples: `{:ok, result}` / `{:error, reason}`.
- Group related operations logically.
- Keep public API small and stable.
