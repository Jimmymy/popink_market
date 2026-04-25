# Popink Market Milestones

This document is the working project plan. It translates `SPEC.md` into staged execution, tracks progress, and records decisions that affect implementation.

## Status Legend

- `Planned`: Not started.
- `In Progress`: Actively being worked on.
- `Blocked`: Waiting for a decision, dependency, or external input.
- `Done`: Implemented and verified.
- `Deferred`: Intentionally moved out of the current phase.

## Current Focus

Current milestone: `M1 - Japan B2B Demo Foundation`

Current objective: Replace the official Medusa starter assumptions with a Japan-focused tattoo supply B2B demo while keeping the stack easy to run locally.

## Milestone Overview

| ID | Name | Status | Goal |
| --- | --- | --- | --- |
| M0 | Project Environment Baseline | Done | Create a runnable local Medusa + Next.js + PostgreSQL + Redis baseline. |
| M1 | Japan B2B Demo Foundation | In Progress | Configure Japan/JPY demo commerce data and tattoo product sample catalog. |
| M2 | Storefront Content Pass | Planned | Replace official starter copy and navigation with Popink Market demo content. |
| M3 | Demo Purchase Flow | Planned | Verify browse, cart, checkout, demo payment, and admin order review. |
| M4 | Maintenance And Deployment Prep | Planned | Prepare local operations docs and lightweight server migration notes. |

## M0 - Project Environment Baseline

Status: `Done`

Spec links:

- `SPEC.md` section 2.1: Current stage goals
- `SPEC.md` section 7.3: Deployment principles
- `SPEC.md` section 10: Phase-one acceptance criteria

Completed:

- Initialized Git repository.
- Added Node version pin with `.node-version`.
- Installed and selected Node `22.22.2` through `fnm`.
- Created Medusa backend in `apps/backend`.
- Created Next.js storefront in `apps/storefront`.
- Added Docker PostgreSQL and Redis services.
- Ran Medusa migrations and seed.
- Created local admin user.
- Verified backend build.
- Verified storefront build.
- Verified local backend and storefront URLs.
- Added local setup documentation in `README.md`.

Verification:

- `npm run build --workspace=@dtc/backend`
- `npm run build --workspace=@dtc/storefront`
- `http://localhost:9000/health`
- `http://localhost:8000`

Known follow-up:

- npm audit reports vulnerabilities from the official starter dependency tree. Do not run `npm audit fix --force` without a separate dependency review.

## M1 - Japan B2B Demo Foundation

Status: `In Progress`

Spec links:

- `SPEC.md` section 4.3: Sample products
- `SPEC.md` section 6.1: Product price visibility
- `SPEC.md` section 6.4: Payment
- `SPEC.md` section 6.5: Logistics
- `SPEC.md` section 8.4: Internationalization preparation

Goal:

Replace the official starter's default demo assumptions with Japan-market demo data suitable for tattoo supplies.

Tasks:

- `Planned`: Configure Japan as the demo region.
- `Planned`: Configure JPY pricing as the storefront default.
- `Planned`: Replace default category structure with tattoo supply categories.
- `Planned`: Add sample products for consumables, equipment, ink, and aftercare.
- `Planned`: Add simple inventory levels for sample products.
- `Planned`: Keep demo/manual payment enabled.
- `Planned`: Keep demo/manual shipping enabled.
- `Planned`: Update storefront default region from starter default to Japan.
- `Planned`: Verify products appear in storefront.
- `Planned`: Verify products appear in Medusa admin.

Acceptance criteria:

- Storefront opens under the Japan/default region path.
- Product list shows tattoo-related sample products.
- Product details show JPY prices.
- Cart can accept sample products.
- Admin can view the new sample products and inventory.

Open decisions:

- Whether demo storefront customer-facing copy should be Japanese from M1 or deferred to M2.
- Whether product names should be Japanese, English, or bilingual in the sample catalog.

Default assumption until changed:

- Use Japanese customer-facing copy for storefront-visible content.
- Use English identifiers in code and seed scripts.

## M2 - Storefront Content Pass

Status: `Planned`

Spec links:

- `SPEC.md` section 3: Target users
- `SPEC.md` section 4.1: Storefront features
- `SPEC.md` section 7.2: Frontend principles

Goal:

Make the storefront look and read like an early Popink Market demo instead of an official Medusa starter.

Tasks:

- `Planned`: Replace homepage hero copy.
- `Planned`: Replace navigation labels.
- `Planned`: Replace footer content.
- `Planned`: Remove or hide Medusa starter branding where appropriate.
- `Planned`: Add basic B2B positioning copy.
- `Planned`: Add placeholder content pages if the starter supports them cleanly.
- `Planned`: Keep frontend changes light and maintainable.

Acceptance criteria:

- First screen clearly identifies Popink Market.
- Navigation supports product discovery.
- Footer no longer reads like a generic starter.
- Mobile viewport remains usable even though PC is the first target.

## M3 - Demo Purchase Flow

Status: `Planned`

Spec links:

- `SPEC.md` section 4.1: Storefront features
- `SPEC.md` section 6.2: User registration
- `SPEC.md` section 6.3: Checkout information
- `SPEC.md` section 10: Phase-one acceptance criteria

Goal:

Confirm the demo supports a complete basic buying flow.

Tasks:

- `Planned`: Register a demo customer.
- `Planned`: Log in as demo customer.
- `Planned`: Add product to cart.
- `Planned`: Enter Japanese-style shipping address sample.
- `Planned`: Select demo shipping.
- `Planned`: Select demo payment.
- `Planned`: Place demo order.
- `Planned`: Confirm order appears in admin.
- `Planned`: Record any gaps in `docs/DECISIONS.md` or this milestone file.

Acceptance criteria:

- A non-technical reviewer can complete a demo order locally.
- The order is visible in the admin panel.
- Any broken starter behavior is documented before deeper customization starts.

## M4 - Maintenance And Deployment Prep

Status: `Planned`

Spec links:

- `SPEC.md` section 7.3: Deployment principles
- `SPEC.md` section 8.1: Maintainability
- `SPEC.md` section 8.2: Scalability
- `SPEC.md` section 8.3: Portability

Goal:

Prepare the project for stable local operation and a later lightweight server deployment.

Tasks:

- `Planned`: Document common local commands.
- `Planned`: Document how to reset local demo data.
- `Planned`: Document environment variables.
- `Planned`: Add notes for lightweight server deployment.
- `Planned`: Identify which services must become managed services later.
- `Planned`: Review security-sensitive defaults before any public deployment.

Acceptance criteria:

- Local setup can be repeated from documentation.
- Demo data reset path is clear.
- Public deployment blockers are documented.

## Progress Log

| Date | Milestone | Update |
| --- | --- | --- |
| 2026-04-25 | M0 | Created project baseline with Medusa backend, Next.js storefront, PostgreSQL, Redis, local admin, and successful builds. |
| 2026-04-25 | M1 | Created milestone workflow and started Japan B2B demo foundation planning. |
