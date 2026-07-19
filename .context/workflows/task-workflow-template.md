# Task Workflow Template

Use this template when starting any non-trivial task.

## Before Starting

1. Read `.context/overview.md` — confirm tech stack and entry points
2. Read relevant subdirectory docs (e.g., `domains/entities.md` for model changes)
3. Check `decisions.md` for any ADRs that constrain your approach
4. Check `retrospectives.md` for known pitfalls

## Task Checklist

- [ ] Understand the scope — what files will change?
- [ ] Check for existing tests covering affected code
- [ ] Follow patterns in `architecture/patterns-template.md`
- [ ] Follow naming conventions in `standards/naming-conventions.md`
- [ ] Follow error handling in `standards/error-handling.md`
- [ ] Run `npm test` before and after changes
- [ ] Run `npm run build` to confirm build passes

## After Completing

- [ ] Update `domains/entities.md` if models changed
- [ ] Update `decisions.md` if an architectural decision was made
- [ ] Add entry to `retrospectives.md` if anything was learned
- [ ] Commit `.context/` changes alongside source changes

## Branch / PR

- Branch from `develop` using format `{username}/{short-description}`
- PR targets `master`
- CI must pass before merge
