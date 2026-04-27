---
component_type: liveview
session_type: design
---

# LiveView Design Rules

## Structure

- A LiveView should correspond to a clear route and user surface.
- Keep LiveViews focused; move domain behavior into contexts.
- Document mount, params, events, template structure, and data flow in the spec.

## Selectors

- Use stable `data-role` attributes for key interactive elements and QA targets.
- Do not rely on visual text alone for automated QA.

## State and Errors

- Verify durable domain state, not only flash messages.
- Handle context errors explicitly.
- Do not pattern-match external service success in a way that crashes the LiveView.

## Design System

- Use project design-system classes/components.
- Avoid inline scripts in HEEx.
- JavaScript hooks must have stable DOM ownership and `phx-update="ignore"` when appropriate.
