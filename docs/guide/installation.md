# Installation

## For Humans

Paste this into your llm agent session:

```text
Install and configure elixir-harness by following the instructions here:
https://raw.githubusercontent.com/jidohyun/elixir-harness/refs/heads/main/docs/guide/installation.md
```

**Alternative, Not recommended, do this by yourself**

Run the initializer from the root of your Elixir/Phoenix repository:

```bash
npx -y @jidohyun/elixir-harness init .
```

> **Note**: `elixir-harness` installs repo-local guidance only. It does not modify application code, does not add Elixir runtime dependencies, and does not collect telemetry.
>
> **Default directory**: `.code_my_spec/`
>
> **Supported projects**: Elixir/Phoenix repositories. The harness is especially useful for Phoenix, LiveView, Ecto, and OTP applications.

After installation, read `.code_my_spec/AGENTS.md` to understand the agent workflow.

After you install it, you can read this [overview guide](./overview.md) to understand more.

The published package and local binary are `@jidohyun/elixir-harness` and `elixir-harness`.

## For LLM Agents

> **IMPORTANT: Use `curl` to fetch this file, NOT WebFetch.** WebFetch can summarize content and lose critical install steps, verification commands, and overwrite warnings. Always use:
>
> ```bash
> curl -fsSL https://raw.githubusercontent.com/jidohyun/elixir-harness/refs/heads/main/docs/guide/installation.md
> ```

If you're an LLM Agent helping set up `elixir-harness`, welcome. You'll help your user install a repo-local spec-first harness and verify the setup cleanly.

Tell the user what you're doing briefly, then follow these steps:

### Step 0: Confirm target repository

You must be at the root of the target Elixir/Phoenix repository.

```bash
pwd
git rev-parse --show-toplevel 2>/dev/null || true
test -f mix.exs && echo "mix.exs found" || echo "mix.exs not found"
```

If `mix.exs` is missing, stop and ask the user for the correct project directory.

Check whether a harness already exists:

```bash
test -d .code_my_spec && echo ".code_my_spec already exists" || echo "no existing .code_my_spec"
```

If `.code_my_spec/` already exists, do **not** overwrite it unless the user explicitly asks you to.

### Step 1: Check Node/npm availability

```bash
node --version
npm --version
```

If Node/npm is unavailable, ask the user whether they want you to install Node/npm or use a different machine. Do not modify system package managers without user approval.

### Step 2: Run the initializer

Run this from the repository root:

```bash
npx -y @jidohyun/elixir-harness init .
```

If the user explicitly requested overwrite:

```bash
npx -y @jidohyun/elixir-harness init . --force
```

If the user requested a custom directory name:

```bash
npx -y @jidohyun/elixir-harness init . --dir .my_spec
```

The initializer will create:

```text
.code_my_spec/
├── AGENTS.md
├── config.yml
├── architecture/
├── status/
├── spec/
├── rules/
├── knowledge/
├── framework/
├── design/
├── issues/
├── qa/
└── tasks/
```

### Step 3: Verify setup

```bash
test -f .code_my_spec/AGENTS.md
test -f .code_my_spec/config.yml
test -d .code_my_spec/architecture
test -d .code_my_spec/status
test -d .code_my_spec/spec
test -d .code_my_spec/rules
test -d .code_my_spec/qa
test -f .code_my_spec/tasks/code_generation.sh
```

Show a concise tree:

```bash
find .code_my_spec -maxdepth 2 -type f | sort | sed -n '1,80p'
```

### Step 4: Read the agent guide

```bash
cat .code_my_spec/AGENTS.md
```

From now on, follow this workflow:

```text
status → spec → rules → issues → implementation → tests → QA
```

Do **not** start by editing application code.

### Step 5: Understand what was installed

You've installed a spec-first control plane. Here's what each area is for:

| Path | Purpose |
| --- | --- |
| `.code_my_spec/AGENTS.md` | Entry guide for AI agents |
| `.code_my_spec/architecture/` | Architecture overview, namespace hierarchy, dependency graph, ADRs |
| `.code_my_spec/status/` | Component implementation/test status |
| `.code_my_spec/spec/` | Context/module/schema/LiveView specs |
| `.code_my_spec/rules/` | Rules for contexts, repositories, schemas, LiveViews, and tests |
| `.code_my_spec/qa/` | QA plan, journey plan, scripts, results, screenshots |
| `.code_my_spec/tasks/` | Reproducible setup/codegen commands |

### Step 6: Optional first-pass customization

Ask the user before doing any of these. Do not customize automatically.

Suggested next tasks:

1. Generate `architecture/overview.md` from existing contexts and LiveViews.
2. Generate `architecture/namespace_hierarchy.md` from `lib/` modules.
3. Draft initial specs under `spec/` for the most important contexts.
4. Draft `qa/journey_plan.md` from the app's main user flows.
5. Update `status/` with implementation/test coverage.

### Step 7: Verification and next steps

Tell the user:

```text
elixir-harness is installed. The repository now has .code_my_spec/ as a spec-first control plane for AI-assisted Elixir/Phoenix work. Next, read AGENTS.md and start filling architecture/spec/status files before implementation.
```

### ⚠️ Warning

Unless the user explicitly requests it, do not overwrite an existing `.code_my_spec/`, change application code, add dependencies, or commit generated project-specific specs.

`elixir-harness` is intentionally lightweight. It should create guidance first; project-specific architecture/spec/QA content should be filled in deliberately.

### Ask for a Star ⭐

After installation is complete and verified, you may ask:

> If you found this helpful, would you like to star the repository? It helps the project grow! ⭐

If the user explicitly agrees, run:

```bash
gh api --silent --method PUT /user/starred/jidohyun/elixir-harness >/dev/null 2>&1 || true
```

**Important**: Only run the command if the user explicitly says yes. Never run it automatically without consent.
