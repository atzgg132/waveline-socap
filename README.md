# Waveline

Public reconstruction of one [Social Capital Inc.](https://sociallcapital.com) (`sociallcapital.com` / `@socapinc`) creator wave (Wispr Flow).
**Not affiliated.** Compiled for a SoCap application.

Anyone with Node.js 22+ can clone and run this. There is no “scaffold in progress” step.

## Quick start

```bash
git clone https://github.com/atzgg132/waveline-socap.git
cd waveline-socap
npm install
npm run dev
```

Vite serves the SPA at `http://localhost:5173`.

| Route | What |
|-------|------|
| `/` | Ledger of all rows + URL filters + pinned Insight A |
| `/launch/wispr-flow` | Chronological depth timeline (`launch_key === "wispr_flow"`) |
| `/method` | Public-sources method + confidence notes |
| `/APPLY.md` | Application memo (same as repo-root `APPLY.md`; Why SoCap blank) |

Filters (query params): `product` → client/launch_key; `platform`; `role` → author_type; `wave` → additive `wave`; `confidence`; `from`/`to` on `datetime_utc`.

`null` metrics render as —. The app does not invent posts or counts.

## Scripts

```bash
npm install          # install deps
npm run dev          # sync-data, then Vite dev server
npm run build        # sync-data, typecheck, emit dist/
npm run preview      # serve dist/ locally
npm run sync-data    # copy data/launches.json → public/data/launches.json
```

`dev` and `build` already run `sync-data`.

## Data

| Path | Role |
|------|------|
| `data/launches.json` | Corpus source of truth (**69** CoS rows) |
| `public/data/launches.json` | Runtime file the SPA fetches (`/data/launches.json`) |

To refresh rows: edit `data/launches.json` (locked shape in `docs/SCHEMA.md`), run `npm run sync-data`, commit **both** files, redeploy.

Additive `wave` values in this pack: `wispr-ph-2024-09`, `wispr-android-2026-02`, `wispr-wom`, `wispr_flow_x`.

## Deploy on Vercel

1. Import this GitHub repo at [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. `vercel.json` already rewrites SPA routes to `index.html` (static `/data/launches.json` is still served as JSON).

CLI (if logged in):

```bash
npx vercel --prod
```

## Docs

| File | Role |
|------|------|
| `APPLY.md` | Application memo (personal fields filled by Arnav; Why SoCap blank on purpose). Live: `/APPLY.md`. Do not email. |
| `INSIGHT.md` | Insight A (draft craft / taste QA) |
| `docs/SCHEMA.md` | Locked row contract |
| `data/sources.md` | How rows were verified |
| `data/rejected.md` | What was considered and not added |
