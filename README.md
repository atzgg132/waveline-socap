# Waveline — public SoCap creator-wave ledger

Static reconstruction of public posts around Social Capital Inc. (SoCap) and the Wispr Flow Android launch. Not affiliated. Compiled for a SoCap application.

Live paths:

- `/` — Insight A pinned + ledger table with filters (`launch_key`, `platform`, `author_type`, `asset_type`, `is_video`, `wave`)
- `/launch/wispr-flow` — T-0 hero first, then `posted_offset_hours` (nulls last)
- `/method` — collection notes, limitations, non-claims, `/work` fetch note, YouTube oEmbed wiring

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + Vite; also GET sociallcapital.com/work into src/data/work-snapshot.json
npm run preview
```

`npm run build` must pass. The build copies `data/` into `dist/data/`.

## Data

Source of truth: [`data/launches.json`](data/launches.json) (69 rows). Do not invent rows.

Also in-repo:

- [`data/x-wave-arnav.json`](data/x-wave-arnav.json) — 29-row X dump (x-wf-001..029); merged by URL
- [`data/sources.md`](data/sources.md) — every URL in the ledger plus dump notes
- [`data/thesis-checkpoint.md`](data/thesis-checkpoint.md) — Insight A checkpoint
- [`INSIGHT.md`](INSIGHT.md) — pinned wording on `/`
- [`APPLY.md`](APPLY.md) — email draft with blank placeholders; do not send

Schema (required unless marked optional):

`id`, `launch_key`, `client`, `date`, `datetime_utc`, `asset_type`, `platform`, `author_handle`, `author_name`, `author_type`, `followers_approx`, `is_video`, `hook_type`, `hook_text`, `posted_offset_hours`, `metrics` (`views`, `likes`, `replies` and/or `comments`, `reposts`, `bookmarks`), `url`, `source_note`, `confidence` (`high` | `medium` | `low`), `wave` (optional)

`launch_key` in this corpus is `wispr_flow`. The route slug is `wispr-flow`.

## Add a row

1. Append one JSON object to `data/launches.json` with the fields above. Use `null` for unknown metrics, offsets, or follower counts.
2. Paste the URL under “In launches.json” in `data/sources.md`.
3. If it is an X-wave item, keep `data/x-wave-arnav.json` in sync or note why it is ledger-only.
4. Run `npm run build`. Confirm the row on `/` and that **open** hits the real URL.

Do not add a row without a public URL. Do not mark `confidence: high` without a primary source. Do not invent a SoCap contract for a creator quote.

## Insight A (pinned)

SoCap does not win launches by owning the biggest follower graph. On Wispr Flow’s Android drop, the scarce resource is draft capacity and taste QA: a stranger-hook hero film on an already-viral founder account, then voice-matched posts that share talking points without identical captions.

Falsify: identical captions ordered by follower count, or if `@socapinc` never claimed the launch.

Full text: `INSIGHT.md`.

## Known gaps

- X wave for this Wispr Android drop is in `data/launches.json` (merged from `data/x-wave-arnav.json`).
- Medium/low creator rows are launch-adjacent; unpaid vs contracted is unproven unless tagged `socap_staff` / `socap_official` / `client_official`.
- `followers_approx` is often null — cannot test follower-rank order from this file alone.
- No YouTube URLs in the current JSON; oEmbed is wired and stays quiet.
- Poly AI is a claim inside a hiring post, not a second hero URL in this pass.

## Non-claims

- Not affiliated with SoCap, Wispr Flow, or listed authors.
- Not a complete history of every Wispr mention on the internet.
- Not proof that every quote-tweet was ghostwritten.
- Homepage “300M views/mo” is SoCap copy, not a per-row metric here.

## Deploy

Static files in `dist/`. SPA fallback: `vercel.json` / `netlify.toml` rewrite to `index.html`. GitHub Pages workflow builds with `VITE_BASE=/waveline-socap/`.
