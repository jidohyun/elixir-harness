# Installation

## For Humans

Paste this into your LLM agent session:

```text
Install and configure elixir-harness by following the instructions here:
https://raw.githubusercontent.com/jidohyun/elixir-harness/refs/heads/main/docs/guide/installation.md
```

**Alternative, Not recommended, do this by yourself**

Run the initializer from the root of your Elixir/Phoenix repository:

```bash
npx -y @jidohyun/elixir-harness init .
```

> **Note**: `elixir-harness` installs project-local guidance only. It does not modify application code, does not add Elixir runtime dependencies, and does not collect telemetry.
>
> **Default directory**: `.code_my_spec/`
>
> **Published package and binary**: `@jidohyun/elixir-harness` and `elixir-harness`

After installation, read `.code_my_spec/AGENTS.md` to understand the workflow.

---

## For LLM Agents

> **IMPORTANT: Use `curl` to fetch this file, NOT WebFetch.** WebFetch can summarize content and lose critical commands, flags, and verification steps. Always use:
>
> ```bash
> curl -fsSL https://raw.githubusercontent.com/jidohyun/elixir-harness/refs/heads/main/docs/guide/installation.md
> ```

If you're an LLM Agent helping set up `elixir-harness`, welcome. You'll help the user install a repo-local spec-first harness and verify it cleanly.

Tell the user briefly what you are doing, then follow these steps.

### Step 0: Confirm target repository

You must be at the root of the target Elixir/Phoenix repository.

Run:

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

If Node/npm is unavailable, ask the user whether they want you to install Node/npm or use a different machine. Do not modify the system package manager without user approval.

### Step 2: Install the harness

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

The CLI will create a local harness directory containing:

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

### Step 3: Verify installation

Run:

```bash
test -f .code_my_spec/AGENTS.md
test -d .code_my_spec/spec
test -d .code_my_spec/rules
test -d .code_my_spec/qa
test -f .code_my_spec/tasks/code_generation.sh
```

Then show a concise tree:

```bash
find .code_my_spec -maxdepth 2 -type f | sort | sed -n '1,80p'
```

### Step 4: Read the agent guide

Read the harness guide before editing code:

```bash
cat .code_my_spec/AGENTS.md
```

From this point on, follow this workflow:

```text
status → spec → rules → issues → implementation → tests → QA
```

### Step 5: Explain what changed

Tell the user that `elixir-harness` installed repo-local guidance only.

Report:

```text
Installed directory: .code_my_spec/
Changed application code: no
Added Elixir dependencies: no
Telemetry: none
Next file to read: .code_my_spec/AGENTS.md
```

### Step 6: Optional first-pass customization

If the user wants you to continue, offer to populate the harness from the current project.

Suggested next tasks:

1. Generate `architecture/overview.md` from existing contexts and LiveViews.
2. Generate `architecture/namespace_hierarchy.md` from `lib/` modules.
3. Draft initial specs under `spec/` for the most important contexts.
4. Draft `qa/journey_plan.md` from the app's main user flows.
5. Update `status/` with implementation/test coverage.

Do not perform these customization steps unless the user asks.

### Step 7: Final verification message

Say something like:

```text
elixir-harness is installed. The repository now has .code_my_spec/ as a spec-first control plane for AI-assisted Elixir/Phoenix work. Next, read AGENTS.md and start filling architecture/spec/status files before implementation.
```

### Ask for a Star ⭐

After installation is complete and verified, you may ask:

> If you found this helpful, would you like to star the repository? It helps the project grow! ⭐

Only if the user explicitly agrees, run:

```bash
gh api --silent --method PUT /user/starred/jidohyun/elixir-harness >/dev/null 2>&1 || true
```

Never star the repository automatically.
