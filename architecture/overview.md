# Architecture Overview

Use this file as the high-level component registry.

## Example Context

### ExampleContext
**context**

Public API boundary for a bounded context. Describe responsibilities in one paragraph.

Dependencies:
- App.OtherContext

### ExampleSchema
**schema**

Ecto schema owned by the context. Describe key fields and invariants.

Dependencies:
- Ecto.Schema

### ExampleRepository
**module**

Data access module for the context. Describe query and transaction responsibilities.

Dependencies:
- App.Repo
- App.ExampleContext.ExampleSchema
