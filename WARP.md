# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Monorepo for the "League For All Seasons" Sleeper dynasty-league playoff visualization.

- **frontend/** – React + Vite SPA that renders the playoff brackets, standings, and matchup views.
- **backend/** – Node/TypeScript utilities for matchup history caching and data management used by the frontend.
- **CI** – GitHub Actions workflows for linting and tests.

For **detailed frontend architecture and bracket engine docs**, see `frontend/WARP.md` (this root file is intentionally high-level).

## Workspace & Tooling Layout

- Root uses **npm workspaces** with `frontend` and `backend` as workspaces.
- All Node tooling (ESLint, Jest, Playwright, TypeScript, Tailwind, DaisyUI) is configured under `frontend/` and reused by `backend/` where appropriate.
- Default Node version in CI is **22** (see `.github/workflows/*`).

## Core Development Commands

Run all commands from the **repo root** unless otherwise noted.

### Install

- Install all workspace dependencies:
  - `npm install`
- To follow the README flow for just the app:
  - `cd frontend && npm install`

### Frontend: Dev, Build, Preview

- Start dev server (Vite, default at `http://localhost:5173`):
  - `cd frontend && npm run dev`
- Production build:
  - `cd frontend && npm run build`
- Preview production build locally:
  - `cd frontend && npm run preview`

### Linting

- Lint **both** frontend and backend:
  - `npm run lint`
- Lint frontend only:
  - `npm run lint -w frontend`
- Lint backend TypeScript (uses frontend ESLint config):
  - `npm run lint -w backend`

### Formatting (frontend workspace)

Run from `frontend/`:

- Check formatting:
  - `npm run format`
- Write formatting changes:
  - `npm run format:write`

### Tests (Jest + React Testing Library)

All Jest commands target the **frontend** workspace.

From repo root (using workspaces):

- Run full Jest suite (unit + integration):
  - `npm test -w frontend`
- CI-style Jest run (single process, CI flags):
  - `npm run test:ci -w frontend`
- Watch mode:
  - `npm run test:watch -w frontend`

From `frontend/` directly:

- Full suite: `npm test`
- Watch: `npm run test:watch`
- CI run: `npm run test:ci`

**Run a single Jest test file** (examples):

- From root:
  - `npm test -w frontend -- src/pages/StandingsPage.test.tsx`
- From `frontend/`:
  - `npm test -- src/pages/StandingsPage.test.tsx`

Any additional Jest CLI flags can be appended after `--`.

### E2E Tests (Playwright)

Playwright lives in the **frontend** workspace.

From repo root:

- Run E2E smoke tests against the URL configured via `E2E_BASE_URL` (used in CI against staging):
  - `npm run test:e2e -w frontend`

From `frontend/` directly:

- E2E against `E2E_BASE_URL` (typically staging):
  - `npm run test:e2e`
- E2E against a **local dev server** (expects app at `http://localhost:5173`):
  - Start dev server: `npm run dev`
  - In another shell: `npm run test:e2e:local`
- Headed mode for local debugging:
  - `npm run test:e2e:headed`

### Matchup History Fetch (Backend Script)

The backend provides a script to cache matchup history into the frontend data store.

- Run from **frontend/** (as documented in `frontend/WARP.md`):
  - `cd frontend && npm run fetch:matchups`
- Equivalent from repo root using workspaces:
  - `npm run fetch:matchups -w frontend`

This invokes `backend/scripts/updateMatchupHistory.ts` (via `ts-node`) to update `frontend/src/data/matchupHistoryStore.json`.

## High-Level Architecture

### Frontend SPA

- Single-page app built with **React + Vite + TypeScript**, styled with **Tailwind CSS + DaisyUI**.
- Integrates directly with Sleeper public APIs to fetch league users, rosters, standings, and playoff bracket data.
- Core pages (routes) live under `frontend/src/pages/` and cover:
  - **Playoffs If Today** – preview bracket based on current standings.
  - **Playoffs Live** – live playoff bracket driven by real Sleeper outcomes.
  - **Matchups** – historical weekly matchup results.
  - **Standings** – season standings, division-aware insights, and narratives.
- A **data-driven bracket engine** (see `frontend/WARP.md` for details) powers the three brackets (Champ, Keeper, Toilet) via immutable templates, routing rules, and a routing engine that applies game outcomes.

### Backend Utilities

- `backend/` contains TypeScript utilities that are **not a long-running service** but are invoked via npm scripts.
- Primary responsibilities:
  - Fetch full matchup history from Sleeper.
  - Persist/cache this data (via SQLite and JSON) for fast access by the frontend.
- Linting for backend TypeScript is wired through the frontend ESLint configuration (`backend/package.json` delegates to `frontend` ESLint setup).

### CI Workflows

- **Lint workflow** (`.github/workflows/lint.yml`):
  - Node 22, `npm ci`, then `npm run lint -w frontend`.
- **Test workflow** (`.github/workflows/test.yml`):
  - Jest CI run: `npm run test:ci -w frontend`.
  - Conditional Playwright E2E smoke run against staging (`E2E_BASE_URL` set to the deployed URL).

Future changes to commands or workflows should keep these CI expectations in mind.
