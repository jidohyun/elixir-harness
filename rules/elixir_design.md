---
component_type: elixir
session_type: design
---

# Elixir Design Rules

- Prefer pattern matching and explicit function heads.
- Avoid `String.to_atom/1` on user input.
- Use `with`/`case` for tuple-returning flows.
- Do not rescue broad exceptions to fake success.
- Keep functions small and named around domain behavior.
- Add dependencies only when the standard library or existing dependencies are insufficient.
