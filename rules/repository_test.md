---
component_type: repository
session_type: test
---

# Repository Test Rules

- Test valid creation/update/delete paths.
- Test invalid attrs and changeset errors.
- Test scope isolation.
- Test authorization failures where applicable.
- Test transaction rollback for multi-step writes.
- Prefer explicit DB assertions over UI-only assertions.
