---
component_type: schema
session_type: design
---

# Schema Design Rules

- Keep schema invariants explicit in changesets.
- Validate required fields.
- Add database constraints for invariants that must hold under concurrency.
- Pair unique constraints in migrations with `unique_constraint/3` in changesets.
- Avoid casting ownership/scope fields from untrusted params; set them programmatically.
