# Waveline — public SoCap creator-wave ledger

Public reconstruction of one [Social Capital Inc.](https://sociallcapital.com) (`sociallcapital.com` / `@socapinc`) creator wave.
**Not affiliated.** Compiled for a SoCap application.

- Slice: influencers / creators (videos as evidence)
- Depth launch: Wispr Flow (`launch_key=wispr_flow`)
- Waves include `wispr_flow_x` (X status URLs in corpus)
- Corpus: `data/launches.json` (69 CoS rows)
- Runtime (app fetch): `public/data/launches.json`

Does not claim private creator rates, leaked docs, or invented metrics. `null` metrics render as —.

## Run

```bash
npm install
npm run dev
```

Opens Vite at `http://localhost:5173`.

| Route | What |
|-------|------|
| `/` | Home ledger + filters + pinned Insight A |
| `/launch/wispr-flow` | Chronological depth timeline (`launch_key === "wispr_flow"`) |
| `/method` | Public-sources method + confidence notes |

Filters sync to the URL: `product`, `platform`, `role`, `wave`, `confidence`, `from`, `to`.

- **product** → `client` or `launch_key`
- **role** → `author_type`
- **wave** → `wave` (e.g. `wispr_flow_x`), falling back to `launch_key`
- **from / to** → inclusive UTC range on `datetime_utc` (fallback `date`)

## Build

```bash
npm run build
npm run preview
```

`npm run build` copies Corpus → runtime (`npm run sync-data`) then typechecks and emits `dist/`.

## Deploy (Vercel)

SPA fallback is in `vercel.json` (all routes → `index.html`; `/data/launches.json` is still a static file).

1. Push this repo to GitHub.
2. [Import the project](https://vercel.com/new) on Vercel (framework **Vite**, output `dist`, build `npm run build`).
3. Or, with Vercel CLI logged in:

```bash
npx vercel --prod
```

No Vercel token is stored in this repo. If CLI auth is missing, use the dashboard import.

## Refresh `launches.json`

Corpus is the source of truth. The app **never** invents rows.

1. Edit `data/launches.json` to the locked shape in `docs/SCHEMA.md` (same file as `data/SCHEMA.md`).
2. Log verification in `data/sources.md`. Rejects go to `data/rejected.md`.
3. Copy into the runtime path:

```bash
npm run sync-data
```

(`dev` / `build` already run this.) Commit **both** `data/launches.json` and `public/data/launches.json`.

4. Redeploy, or hard-refresh — runtime JSON is cached ~60s (`vercel.json`).

Optional local symlink (Unix) if you do not want two copies while iterating:

```bash
rm public/data/launches.json
ln -s ../../data/launches.json public/data/launches.json
```

Vercel deploys should still commit a real file at `public/data/launches.json` (symlinks are easy to drop).

## Docs

| File | Role |
|------|------|
| `INSIGHT.md` | CoS/Lead Insight A (pinned on home) |
| `APPLY.md` | Application memo **stub** |
| `docs/SCHEMA.md` | Locked row contract |
| `data/sources.md` | How each row was verified |
| `data/rejected.md` | What was considered and not added |
