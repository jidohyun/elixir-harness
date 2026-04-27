# elixir-harness

A repo-local harness for AI-assisted Elixir/Phoenix development, extracted from the CodeMySpec / MetricFlow `.code_my_spec/` workflow and generalized for reuse.

The harness is not an application framework. It is a **spec-first control plane** for coding agents:

- architecture maps
- component status checklists
- per-module specs
- component-type rules
- framework references
- QA plans, journey results, and screenshot evidence
- reproducible generation/setup scripts

## Directory layout

```text
elixir-harness/
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
├── knowledge/
├── framework/
├── design/
├── issues/
├── qa/
│   ├── plan.md
│   ├── journey_plan.md
│   ├── preflight.md
│   ├── scripts/
│   └── results/
└── tasks/
    └── code_generation.sh
```

## How agents should use it

Before implementing or modifying a component:

1. Read `AGENTS.md`.
2. Check `status/` to understand implementation/test state.
3. Read the relevant `spec/<module_path>.spec.md`.
4. Read the applicable `rules/*` files.
5. Check `issues/` for known problems.
6. Implement.
7. Run BDD/surface tests and QA as documented in `qa/`.

## Core workflow

```text
Architecture discovery
→ Component status check
→ Spec-first implementation
→ Component rules lookup
→ Bounded implementation
→ BDD / surface test
→ Browser QA / evidence capture
→ Preflight verification
```

## Integration into another repo

Copy this directory into a project as `.code_my_spec/` or keep it as a submodule/template. Then fill in:

- `architecture/overview.md`
- `architecture/namespace_hierarchy.md`
- `spec/**/*.spec.md`
- `status/**/*.md`
- `qa/journey_plan.md`

Do not commit secrets, browser storage state, local `.env` files, build output, or generated screenshots unless they are intentional QA evidence.

## Extracted principles

- Specs must include behavior, process, public API, and test assertions.
- LiveView specs should define stable selectors such as `data-role` for QA.
- QA must verify durable outcomes, not only flash messages or visible text.
- External service failure paths must be specified and tested.
- Runtime config should normalize blank env vars to `nil` where appropriate.
