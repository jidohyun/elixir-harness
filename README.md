# elixir-harness

[한국어 README](./README.ko.md)

A lightweight, repo-local, spec-first harness for AI-assisted Elixir/Phoenix development.

`elixir-harness` does **not** generate an application. It installs a `.code_my_spec/` control plane into your repository so humans and AI agents can share the same architecture map, module specs, rules, QA plan, and verification evidence.

```text
architecture → status → spec → rules → issues → implementation → QA
```

## Installation

### For LLM Agents

Fetch the installation guide and follow it:

```bash
curl -s https://raw.githubusercontent.com/jidohyun/elixir-harness/refs/heads/main/docs/guide/installation.md
```

Quick install, if you are already at the root of the target Elixir/Phoenix repository:

```bash
npx -y @jidohyun/elixir-harness init .
```

Then read:

```bash
.code_my_spec/AGENTS.md
```

Note: `elixir-harness` installs project-local guidance only. It does not collect telemetry, does not modify application code, and does not add runtime dependencies to your Elixir project. The default harness directory is `.code_my_spec/`. Use `--dir <name>` if the project wants a different directory.

### For humans

Use directly with `npx`:

```bash
cd my_phoenix_app
npx @jidohyun/elixir-harness init
```

Or install globally:

```bash
npm install -g @jidohyun/elixir-harness
cd my_phoenix_app
elixir-harness init
```

Options:

```bash
elixir-harness init [target] [options]

Options:
  --dir <name>   Harness directory name. Default: .code_my_spec
  --force        Overwrite an existing harness directory
  --dry-run      Show what would be copied without writing files
  --help         Show help
```

Examples:

```bash
elixir-harness init
elixir-harness init ./my_phoenix_app
elixir-harness init ./my_phoenix_app --dir .my_spec
elixir-harness init --dry-run
```

## What it creates

```text
.code_my_spec/
├── AGENTS.md                  # Agent guide and workflow entrypoint
├── config.yml                 # Paths ignored by harness/status/spec checks
├── architecture/              # Architecture map, dependency graph, ADRs
│   ├── overview.md
│   ├── namespace_hierarchy.md
│   ├── dependency_graph.mmd
│   └── decisions/
├── status/                    # Per-component implementation/test status
├── spec/                      # Specs for contexts, modules, schemas, LiveViews
│   └── templates/
├── rules/                     # Rules by component type
├── knowledge/                 # Domain/API/operational notes
├── framework/                 # Phoenix, LiveView, Ecto, QA references
├── design/                    # Design-system documentation
├── issues/                    # Known bugs and technical debt
├── qa/                        # QA plans, journeys, scripts, results
└── tasks/                     # Reproducible setup/codegen scripts
```

## Why this exists

AI agents are fast, but speed amplifies ambiguity. A vague story can become vague tests, vague code, and false-positive QA. This harness makes project context explicit and versioned.

It helps teams keep:

- architecture decisions near the code
- module-level specs before implementation
- component rules for contexts, repositories, schemas, and LiveViews
- stable selectors for browser QA
- QA journeys and evidence in the repository
- reproducible setup/codegen commands

## Agent workflow

Before implementing a component:

```text
1. Check .code_my_spec/status/
2. Read .code_my_spec/spec/
3. Read .code_my_spec/rules/
4. Check .code_my_spec/issues/
5. Implement the smallest coherent change
6. Add or update tests
7. Run verification
```

Before modifying an existing component:

```text
1. Read the spec
2. Read the implementation
3. Check related issues and QA failures
4. Follow the applicable rule files
5. Preserve existing behavior unless the spec changes it
```

## Spec style

A context spec should describe public API, behavior, process, and test assertions.

````markdown
# App.Accounts

Business accounts and membership management.

## Type
context

## Delegates
- list_accounts/1: Accounts.AccountRepository.list_accounts/1

## Functions

### list_accounts/1

```elixir
@spec list_accounts(Scope.t()) :: list(Account.t())
```

**Process**:
1. Extract user identity from scope.
2. Query accounts through the repository.
3. Return the scoped account list.

**Test Assertions**:
- returns accounts visible to the user
- does not return accounts outside the scope
- returns an empty list when none exist
````

A LiveView spec should include route, dependencies, user interactions, durable outcomes, and stable QA selectors.

````markdown
# AppWeb.DashboardLive.Index

## Type
liveview

## Route
`/dashboards`

## Dependencies
- App.Dashboards

## User Interactions
- **phx-click="delete"** (`data-role="delete-dashboard-{id}"`): Opens confirmation.
- **phx-click="confirm_delete"** (`data-role="confirm-delete-{id}"`): Deletes dashboard.

## Test Assertions
- unauthenticated users are redirected
- page renders expected initial state
- delete success updates durable state
- delete failure shows an error without crashing
````

## Core rules

### Contexts

- Contexts are public API boundaries.
- Public functions that cross user/account/project boundaries should accept a scope/current-user struct.
- Queries must enforce scope and authorization boundaries.
- Return consistent tuples: `{:ok, result}` / `{:error, reason}`.

### Repositories

- Repositories own data access, query composition, and transactions.
- Separate CRUD from query builders.
- Multi-step writes must be atomic.
- Tests should cover rollback behavior.

### LiveViews

- Domain behavior belongs in contexts, not LiveViews.
- Use stable `data-role` selectors for important interactions.
- Do not treat flash messages as proof of success.
- Verify durable state or follow-up observable behavior.
- External service errors must not crash the LiveView through optimistic pattern matches.

## QA philosophy

Bad QA:

```text
A success flash is visible.
```

Better QA:

```text
The action was performed.
Durable domain state changed.
The DB/state/follow-up screen confirms the change.
Failure cases are handled gracefully.
```

## Development

```bash
npm run smoke
npm pack --dry-run
```

## Links

- npm: https://www.npmjs.com/package/@jidohyun/elixir-harness
- GitHub: https://github.com/jidohyun/elixir-harness

## License

MIT
