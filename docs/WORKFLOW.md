# Popink Market Working Rules

This document defines how planning, implementation, and documentation stay connected.

## Source Of Truth

- `SPEC.md` defines product intent, scope, non-goals, and acceptance criteria.
- `docs/MILESTONES.md` defines execution order, current progress, and milestone acceptance criteria.
- `README.md` defines how to run and operate the project locally.
- Code and configuration define the actual implementation.

When these disagree, update them in this order:

1. Update `SPEC.md` if product scope or business rules changed.
2. Update `docs/MILESTONES.md` if execution plan, status, or acceptance criteria changed.
3. Update `README.md` if setup, commands, URLs, accounts, or operational behavior changed.
4. Update code and tests to match the agreed scope.

## Milestone Workflow

Before starting a meaningful implementation task:

- Confirm which milestone the task belongs to.
- Check related `SPEC.md` sections listed in `docs/MILESTONES.md`.
- Mark the task as `In Progress` if it is a tracked milestone task.

During implementation:

- Keep changes scoped to the active milestone unless a dependency forces otherwise.
- If a new requirement appears, add it to `SPEC.md` or the milestone open decisions before implementing it.
- If a task is deferred, mark it as `Deferred` and state why.

After implementation:

- Run relevant verification commands.
- Update task status in `docs/MILESTONES.md`.
- Add a progress-log entry with date, milestone, and result.
- Update `README.md` if commands, environment, or usage changed.

## Decision Rules

Record a decision when it affects future development, deployment, or business scope.

Examples:

- Default frontend language.
- Region and currency assumptions.
- Payment provider strategy.
- Shipping strategy.
- Whether to keep, customize, or replace a Medusa starter feature.
- Whether a requirement is in scope for the current demo.

Small implementation details do not need a decision record unless they create a long-term constraint.

## Git Workflow

- Commit after each stable milestone or coherent feature slice.
- Do not mix unrelated milestone work in one commit.
- Use concise commit messages, for example `chore: establish local medusa baseline`.
- Do not commit `.env`, logs, `node_modules`, build output, or local Docker data.

## Verification Workflow

Use the smallest meaningful verification for each change.

Baseline checks:

```powershell
npm run build --workspace=@dtc/backend
npm run build --workspace=@dtc/storefront
```

Runtime checks:

```powershell
npm run db:up
npm run backend:dev
npm run storefront:dev
```

Expected local URLs:

```text
Backend health: http://localhost:9000/health
Admin:          http://localhost:9000/app
Storefront:     http://localhost:8000
```

## Current Demo Bias

Until the spec changes, prefer these defaults:

- Demo first, production later.
- Japan market assumptions.
- B2B tattoo industry users.
- Public prices for demo.
- No customer approval flow for demo.
- Demo payment and demo shipping only.
- Keep Medusa conventions unless customization is needed for the milestone.

