# Installation Guide for LLM Agents

You are installing `elixir-harness` into an Elixir/Phoenix repository.

## Goal

Initialize a repo-local `.code_my_spec/` harness so future human and AI contributors share the same architecture map, specs, rules, QA plan, and verification workflow.

## Install

Run from the root of the target repository:

```bash
npx -y @jidohyun/elixir-harness init .
```

If `.code_my_spec/` already exists and the user explicitly wants to replace it:

```bash
npx -y @jidohyun/elixir-harness init . --force
```

If the user wants a different directory name:

```bash
npx -y @jidohyun/elixir-harness init . --dir .my_spec
```

## Required follow-up

After installation, read the agent guide:

```bash
cat .code_my_spec/AGENTS.md
```

Then follow this workflow before editing code:

```text
status → spec → rules → issues → implementation → tests → QA
```

## Agent rules

- Do not edit code first.
- Read `.code_my_spec/status/` before starting work.
- Read the relevant `.code_my_spec/spec/**/*.spec.md` before implementation.
- Read applicable `.code_my_spec/rules/*.md` files.
- Check `.code_my_spec/issues/` for known problems.
- Verify durable/domain state, not only flash messages or visible text.
- Preserve existing behavior unless the spec explicitly changes it.

## Verify installation

```bash
test -f .code_my_spec/AGENTS.md
test -d .code_my_spec/spec
test -d .code_my_spec/rules
test -d .code_my_spec/qa
```

If all commands pass, installation is complete.
