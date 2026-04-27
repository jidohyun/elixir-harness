# Harness Structure

## Status
Accepted

## Context

AI-assisted development needs durable repo-local context so agents can discover architecture, rules, specs, and QA expectations without relying on conversation history.

## Decision

Maintain a harness directory containing architecture, status, spec, rules, knowledge, framework references, QA artifacts, and reproducible tasks.

## Consequences

- Agents have a deterministic starting point.
- Specs and QA evidence remain versioned with the project.
- The harness requires maintenance when architecture or conventions change.
