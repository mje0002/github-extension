# .context/ — Knowledge Base Meta

## Purpose

This directory is the persistent knowledge base for the **github-extension** project.
It documents conventions, architecture, domain concepts, and workflows so that AI agents
and new developers can start every task fully informed — without re-reading the entire
codebase.

## How to Use

- **Before starting any task**: read `overview.md`, then the relevant subdirectory.
- **After completing a task**: update affected docs; add lessons learned to `retrospectives.md`.
- **When making architecture decisions**: document them in `decisions.md`.

## Directory Structure

| Path | Contents |
|------|----------|
| `overview.md` | Project summary, tech stack, entry points |
| `decisions.md` | Architecture Decision Records (ADRs) |
| `retrospectives.md` | Lessons learned, recurring issues |
| `standards/` | Coding style, naming, error handling |
| `architecture/` | Patterns, component relationships |
| `testing/` | Test frameworks, conventions, coverage |
| `domains/` | Data models, business rules, glossary |
| `workflows/` | Branching, CI/CD, task workflow |
| `styling/` | UI/UX conventions, MUI usage |
| `tasks/` | Active and completed task specs |

## Maintenance

- Update context docs at the end of each non-trivial task.
- Promote recurring patterns into `architecture/patterns-template.md`.
- Keep `domains/entities.md` in sync with model changes.
