# reports

A small npm-workspaces monorepo that fetches GitLab issue data and computes work-day/hour statistics for monthly time-tracking reports.

## Packages

- **`packages/client`** — React + Vite UI: calendar view with holidays/off-days, monthly stats, and a GitLab issue report table.
- **`packages/server`** — Express API that computes calendar stats and fetches/exports GitLab issue reports.
- **`packages/shared`** — TypeScript types shared between `client` and `server`.

## Getting started

Requires Node.js >= 24.

```bash
npm install
```

Build the shared package first (the client/server consume it via `dist/`):

```bash
npm run build --workspace=packages/shared
```

Create a `.env` file in `packages/server` (not committed):

```
GITLAB_URL=...
PRIVATE_TOKEN=...
USER_ID=...
PORT=3000 # optional
```

Run everything:

```bash
npm run dev
```

This starts the server on `:3000` and the client dev server (Vite) concurrently. You can also run them separately with `npm run dev:server` / `npm run dev:client`.

## Features

- **Calendar** — yearly calendar with holidays, short days, weekends, and additional off-days. Off-days can be added (date range) or removed (with confirmation) directly from the UI.
- **Details** — per-month work-day/hour stats with a progress bar toward the month's required hours.
- **Reports** — sortable table of GitLab issues for the configured user, with time estimates converted to hours; also exports a monthly CSV.
- **Settings** — configure GitLab URL, private token, user ID, employee, and company. Also manages the project code → label dictionary used to prefix report entries: add new codes via a dialog, and remove existing ones with confirmation.

## Scripts

Run from the repo root unless noted.

- `npm run dev` — runs server and client dev servers concurrently.
- `npm run dev:server` — server only.
- `npm run dev:client` — client only.

Per package:

- `packages/shared`: `npm run build` / `npm run dev` (watch mode) — must be built/watched for `@reports/shared` to be picked up.
- `packages/client`: `npm run build`, `npm run lint`, `npm run preview`, `npm test` (Vitest), Cypress e2e via `cypress.config.ts`.
- `packages/server`: `npm test` (Vitest).

## Architecture

1. The client (`App.tsx`) calls `GET /api/counts/:year` and `GET /api/reports` on mount/year-change. Both endpoints stream newline-delimited JSON `StreamEvent` objects (`{ type: 'message' | 'done' | 'error', data }`), defined in `packages/shared/src/types.ts`.
2. `/api/counts/:id` looks up calendar config (holidays, short days, bad days, off-days) for the given year and computes per-month stats (allDays/holidays/weekends/offDays/shortDays/workDays/hours).
3. `/api/reports` fetches open + closed GitLab issues for the configured user, maps project IDs to labels via a JSON-backed project dictionary and statuses via a status dictionary, converts time estimates to hours, writes the result to a monthly CSV, and streams back the issue list.
4. `/api/settings` and `/api/project-dict` persist app configuration and the project code dictionary to JSON files on the server.
5. The client renders the combined state via `MyCalendar` (calendar grid), `Details` (per-month stats), `Report` (sortable issue table), and `Settings` (configuration + project codes).
