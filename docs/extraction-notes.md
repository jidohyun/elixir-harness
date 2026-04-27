# CodeMySpec / MetricFlow Harness Extraction

> Project-specific MetricFlow product details removed. This document extracts the reusable harness/process shape found under `.code_my_spec/`.

## 1. Harness purpose

The harness is a repo-local control plane for AI-assisted Phoenix development. It gives agents:

- a navigable architecture map
- module-level executable-ish specifications
- component-type rules
- implementation status checklists
- framework/reference knowledge
- QA plans, QA scripts, browser evidence, and failure reports
- code generation scripts for initial scaffolding

The important artifact is not the app code. It is the `.code_my_spec/` directory that constrains agents before and after implementation.

## 2. Directory layout

```text
.code_my_spec/
├── AGENTS.md                  # How agents should use the harness
├── config.yml                 # Paths ignored by harness/status/spec checking
├── architecture/              # Component graph, hierarchy, ADRs
│   ├── overview.md
│   ├── namespace_hierarchy.md
│   ├── dependency_graph.mmd
│   └── decisions/*.md
├── status/                    # Per-component implementation/test status
├── spec/                      # One spec per context/module/liveview
├── rules/                     # Coding/design/test standards by component type
├── knowledge/                 # App/domain/integration research notes
├── framework/                 # Reusable framework reference docs
├── design/                    # Design-system assets
├── issues/                    # Known bugs and technical debt
├── qa/                        # QA plan, journey plan, scripts, results, screenshots
└── tasks/                     # Reproducible code generation scripts
```

## 3. Core workflow

```text
1. Architecture discovery
   → architecture/overview.md
   → architecture/namespace_hierarchy.md
   → architecture/dependency_graph.mmd

2. Component status check
   → status/<namespace>.md
   → determines whether spec/code/test exists and passes

3. Spec-first implementation
   → spec/<module_path>.spec.md
   → read intended public API, process, assertions, route/UI behavior

4. Rules lookup
   → rules/<component_type>_design.md
   → rules/<component_type>_test.md

5. Implementation by bounded context/module
   → Phoenix context boundary
   → repository/schema/liveview conventions

6. BDD / surface tests
   → SexySpex + Phoenix.LiveViewTest
   → `mix spex`

7. Browser QA / evidence capture
   → Vibium MCP / browser automation
   → qa/<story_id>/result*.md + screenshots

8. Preflight / final verification
   → compile
   → migrations
   → server health
   → integration verification scripts
```

## 4. Agent orientation file pattern

`AGENTS.md` is the entrypoint. It tells agents where to look before modifying code.

Required behavior:

```text
Before implementing a component:
1. Check `.code_my_spec/status/` — is it already done?
2. Read `.code_my_spec/spec/` — what should it do?
3. Read `.code_my_spec/rules/` — what conventions apply?
4. Check `.code_my_spec/issues/` — known problems?

Before modifying an existing component:
1. Read the spec
2. Read the implementation
3. Check related issues
4. Follow component-type rules
```

## 5. Architecture artifacts

The harness keeps architecture as machine-readable-ish markdown.

### `architecture/overview.md`

Each component has:

```md
## <Context or Area>

### <ComponentName>
**<component_type>**

<one-paragraph responsibility>

Dependencies:
- Some.Dependency
- Another.Dependency
```

### `architecture/namespace_hierarchy.md`

Tree view by namespace:

```text
App
├── Accounts [context] ...
│   ├── Account [schema] ...
│   ├── AccountRepository [module] ...
│   └── Authorization [module] ...
├── Feature [context] ...
└── WebFeature [liveview] ...
```

### `architecture/dependency_graph.mmd`

Mermaid dependency graph. Useful for dependency-order implementation.

### `architecture/decisions/*.md`

ADR-style decision records:

```md
# Decision Title

## Status
Accepted

## Context
...

## Options Considered
...

## Decision
...

## Consequences
...
```

## 6. Spec format

### Context spec

```md
# App.Context

<responsibility paragraph>

## Type
context

## Delegates
- function/arity: ChildModule.function/arity

## Functions

### function_name/arity

<behavior>

```elixir
@spec function_name(Scope.t(), args...) :: return_type
```

**Process**:
1. Step one
2. Step two
3. Return result

**Test Assertions**:
- assertion one
- assertion two
- security/scoping assertion
```

### Repository spec

Repository specs are similar but focus on data access:

```md
# App.Context.Repository

## Type
module

## Functions

### create_entity/2

```elixir
@spec create_entity(Scope.t(), map()) :: {:ok, Entity.t()} | {:error, Ecto.Changeset.t()}
```

**Process**:
1. Validate authorization/scope
2. Build changeset
3. Insert/update transactionally
4. Broadcast if applicable

**Test Assertions**:
- creates with valid attrs
- rejects invalid attrs
- enforces scope isolation
- handles unauthorized caller
```

### LiveView spec

```md
# AppWeb.FeatureLive.Index

<behavior>

## Type
liveview

## Route
`/route`

## Params
...

## Dependencies
- App.Context

## Components
- ...

## User Interactions
- **phx-click="event"** (`data-role="..."`): expected behavior

## Design
Layout, sections, cards, classes, responsive behavior
```

Important: LiveView specs include `data-role` selectors for QA stability.

## 7. Rules layer

Rules are scoped by component type.

Examples:

### Context rules

```text
- All public functions accept Scope as first parameter
- Queries filter by scope foreign keys
- Return consistent {:ok, result} / {:error, reason}
- Keep public API self-documenting
```

### Repository rules

```text
- Basic CRUD grouped separately from query builders
- Query builders use by_ / with_ / search_ naming
- Return {:ok, entity}, {:error, :not_found}, {:error, changeset}
- Transactional operations documented explicitly
```

### LiveView rules

```text
- One LiveView corresponds to one path
- Include route, context access, mount/events/template
- Use design system classes
- Include security and real-time update considerations
- Add stable data-role selectors for tests/QA
```

## 8. Testing harness

### BDD layer

The project used SexySpex:

```text
Framework: SexySpex
Surface testing: Phoenix.LiveViewTest / ConnTest
Command: mix spex
File pattern: test/spex/**/*_spex.exs
Style: Given / When / Then
```

Key decision:

```text
BDD specs should test real routes/surface behavior.
They should fail until the feature is implemented.
```

### Browser QA layer

The repo also used browser automation for QA evidence:

```text
Tool: Vibium MCP
Artifacts:
- qa/plan.md
- qa/journey_plan.md
- qa/<story_id>/brief.md
- qa/<story_id>/result_complete.md
- qa/<story_id>/result_failed_*.md
- qa/<story_id>/screenshots/*.png
```

Important discovered convention:

```text
For Phoenix session redirects, wait for URL rather than waiting for body/selector.
Phoenix signed session cookies may not restore cleanly via storage_state.
Each QA run logs in fresh.
```

## 9. QA artifact format

### QA plan

Contains:

```md
# QA Plan

## App Overview
## Tools Registry
## Auth Workflow
## Key Tool Patterns
## Integration Tools
## Known Pitfalls
```

### Journey plan

Contains end-to-end user journeys:

```md
# QA Journey Plan

## Prerequisites
- server running
- database migrated
- QA seeds loaded
- browser automation available

## Existing Data State
- users
- accounts
- integrations
- metrics

## Journeys
### Journey 1: ...
Role:
Steps:
Expected outcome:
```

### Result files

Capture:

```md
# QA Result

Status: complete | failed
Story / Journey:
Environment:
Steps executed:
Evidence:
- screenshots
Failures:
- observed
- expected
- suspected root cause
```

## 10. Code generation harness

The repo included a reproducibility script:

```bash
mix phx.gen.auth Users User users
mix cms_gen.accounts
mix cms_gen.integrations
mix cms_gen.feedback_widget
mix ecto.migrate

# Optional provider scaffolds:
mix cms_gen.integration_provider Facebook facebook
mix cms_gen.integration_provider Google google
mix cms_gen.integration_provider "Google Ads" google_ads
mix cms_gen.integration_provider "Google Analytics" google_analytics
mix cms_gen.integration_provider QuickBooks quickbooks
```

Extracted idea:

```text
Use generators for repeated architecture skeletons.
Use specs/rules to constrain custom code around generated skeletons.
```

## 11. Reusable minimal harness for another Phoenix project

```text
.my_harness/
├── AGENTS.md
├── config.yml
├── architecture/
│   ├── overview.md
│   ├── namespace_hierarchy.md
│   ├── dependency_graph.mmd
│   └── decisions/
├── status/
├── spec/
├── rules/
│   ├── context_design.md
│   ├── repository_design.md
│   ├── repository_test.md
│   ├── schema_design.md
│   ├── liveview_design.md
│   └── elixir_test.md
├── knowledge/
├── framework/
├── design/
├── issues/
├── qa/
│   ├── plan.md
│   ├── journey_plan.md
│   ├── preflight.md
│   └── scripts/
└── tasks/
    └── code_generation.sh
```

## 12. What to copy into fishing-pond

For `fishing-pond`, the highest-value extraction is:

1. `.code_my_spec/AGENTS.md` pattern → `.hermes/harness/AGENTS.md` or `.fishing_spec/AGENTS.md`
2. `architecture/overview.md` → contexts/components map
3. `spec/<module>.spec.md` → one spec per game state/context/liveview
4. `rules/` → Phoenix/LiveView/game-state rules
5. `qa/journey_plan.md` → actual player journeys
6. `qa/result_*` + screenshots → evidence-based QA
7. `tasks/code_generation.sh` → reproducible scaffold/setup commands

## 13. Main weaknesses to fix when reusing

The harness in MetricFlow still had gaps:

- Spec gate did not prevent ambiguous product behavior.
- QA could pass UI signals without verifying domain state deeply enough.
- External provider failures were not always tested as failure paths.
- Local execution/dev onboarding was under-documented.
- Empty env vars were not normalized consistently.

When adapting, add these rules:

```text
- Every story must include failure examples.
- QA must verify durable domain state, not only flash/UI text.
- External service failures must be tested with fake/no-op adapters.
- Runtime config must normalize blank env vars to nil.
- Every harness spec must include observable acceptance criteria.
```
