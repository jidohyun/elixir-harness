# Elixir Harness Agent Guide

This guide describes how to use the harness directory when working in an Elixir/Phoenix repository.

## Project Structure

```text
.code_my_spec/ or elixir-harness/
├── architecture/          # System component graph and dependencies
├── status/                # Implementation status of every component
├── spec/                  # Specifications for every module
├── rules/                 # Coding standards by component type
├── knowledge/             # Project-specific operational knowledge
├── framework/             # Framework reference docs
├── design/                # Design system assets
├── issues/                # Known bugs and technical debt
├── qa/                    # QA plans, results, scripts, screenshots
└── tasks/                 # Reproducible setup/codegen scripts
```

## Progressive Disclosure: Where to Look

### 1. Orientation

| Need | File |
|---|---|
| List of all components, types, and dependencies | `architecture/overview.md` |
| Hierarchical tree view by namespace | `architecture/namespace_hierarchy.md` |
| Dependency graph | `architecture/dependency_graph.mmd` |
| Architectural decisions | `architecture/decisions/*.md` |

### 2. Status

Check `status/` before starting work. Status files use checklist format:

```md
- [ ] spec_file - Component specification exists
- [ ] implementation_file - Component implementation exists
- [ ] test_file - Component test exists
- [ ] tests_passing - Component tests pass
```

### 3. Specifications

Read `spec/<module_path>.spec.md` before implementing or modifying a module.

Specs should include:

- fully qualified module name
- component type
- public functions and `@spec`s
- dependencies
- process steps
- test assertions
- route and user interactions for LiveViews
- fields for schemas

### 4. Rules

Read the relevant rule files before writing code.

| Component Type | Design Rules | Test Rules |
|---|---|---|
| Context | `rules/context_design.md` | — |
| Repository | `rules/repository_design.md` | `rules/repository_test.md` |
| Schema | `rules/schema_design.md` | — |
| LiveView | `rules/liveview_design.md` | — |
| Elixir general | `rules/elixir_design.md` | `rules/elixir_test.md` |

### 5. Issues

Check `issues/` for known problems and technical debt in the area being modified.

## Working Rules

Before implementing a component:

1. Check `status/` — is it already done?
2. Read `spec/` — what should it do?
3. Read `rules/` — what conventions apply?
4. Check `issues/` — are there known problems?
5. Implement the smallest coherent change.
6. Add/update tests.
7. Run the documented verification command.

Before modifying an existing component:

1. Read the spec to understand intended behavior.
2. Read the current implementation.
3. Check related issues and QA failures.
4. Follow the rule file for that component type.
5. Preserve existing behavior unless the spec explicitly changes it.

## Phoenix Context Conventions

- Contexts are public API boundaries.
- Repositories handle data access.
- Schemas define Ecto data structures.
- Public context functions should consistently accept a scope/current-user context where multi-tenant or authorization boundaries exist.
- Database queries must enforce scope/authorization boundaries.
- Return consistent tuples: `{:ok, result}` / `{:error, reason}`.

## QA Expectations

- Do not treat flash messages as proof of success.
- Verify durable state changes through domain state, DB state, or observable follow-up behavior.
- Include failure paths and external-service failure scenarios.
- Capture browser evidence for end-to-end QA when appropriate.
