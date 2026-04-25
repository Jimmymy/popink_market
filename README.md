# Popink Market

Popink Market is an early-stage B2B ecommerce demo for tattoo industry products in Japan. The project uses Medusa.js for the ecommerce backend and the official Next.js starter storefront.

## Local Stack

- Node.js `22.22.2`
- npm `10.9.7`
- Docker PostgreSQL `16-alpine`
- Docker Redis `7-alpine`
- Medusa.js `2.14.0`
- Next.js `15.3.9`

## Project Layout

```text
apps/backend     Medusa backend and admin
apps/storefront  Next.js storefront
SPEC.md          Product and technical specification
docs/            Milestones and working rules
docker-compose.yml
```

## Planning Workflow

- Product scope lives in `SPEC.md`.
- Execution plan and progress live in `docs/MILESTONES.md`.
- Working rules live in `docs/WORKFLOW.md`.
- Local setup and operations live in this `README.md`.

## First Run

Start local services:

```powershell
npm run db:up
```

Start Medusa backend and admin:

```powershell
npm run backend:dev
```

Start the storefront in a second terminal:

```powershell
npm run storefront:dev
```

Local URLs:

```text
Medusa backend API: http://localhost:9000
Medusa admin:       http://localhost:9000/app
Storefront:         http://localhost:8000
PostgreSQL:         127.0.0.1:5432
Redis:              127.0.0.1:6379
```

Local demo admin:

```text
Email:    admin@popink.local
Password: PopinkAdmin123
```

## Environment

The generated local backend environment is in `apps/backend/.env`.

The generated local storefront environment is in `apps/storefront/.env.local`.

Do not commit real `.env` files. Use `apps/backend/.env.template` and `apps/storefront/.env.example` as references.

## Notes

- The local database has been migrated and seeded by the Medusa installer.
- The current storefront default region is still the official starter seed region. Japan-specific regions, yen pricing, Japanese copy, and tattoo sample products should be added in the next implementation step.
- npm audit currently reports vulnerabilities from the official starter dependency tree. Do not run `npm audit fix --force` blindly because it can break Medusa's pinned package set.
