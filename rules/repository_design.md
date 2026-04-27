---
component_type: repository
session_type: design
---

# Repository Design Rules

## Responsibilities

- Repositories own data access, query composition, and transactional persistence.
- Repositories do not own UI concerns.
- Authorization may be checked here only when the context API explicitly delegates that responsibility.

## Function Organization

- Basic CRUD: `create`, `get`, `update`, `delete`, `list`.
- Query builders: prefix with `by_`, `with_`, `search_`.
- Status transitions: use explicit verbs such as `mark_complete`, `cancel`, `activate`.

## Return Types

- `{:ok, entity}` for successful mutations.
- `{:error, :not_found}` for missing entities.
- `{:error, :unauthorized}` for authorization failure.
- `{:error, changeset}` for validation failure.
- Lists for list queries.
- `Ecto.Query.t()` for query builders.

## Transactions

- Multi-step writes must be atomic.
- Avoid partial persistence.
- Tests must cover rollback behavior for complex transactions.
