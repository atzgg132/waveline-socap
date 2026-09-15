# Waveline — public SoCap creator-wave ledger

Static reconstruction of public posts around Social Capital Inc. (SoCap), with a **runnable multi-API harness** in-repo. Not affiliated. Compiled for a SoCap **Technical Generalist** application.

Live: https://temporary-fleet-silver-h1egabl.vercel.app

## Routes

- `/` — Insight A pinned + ledger (`product / launch_key` including `poly_ai`, `platform`, `author_type`, `asset_type`, `is_video`, `wave`, `socap_claimed` via `?socap_claimed=true|false`)
- `/launch/wispr-flow` — T-0 Wispr hero first, then `posted_offset_hours` (nulls last)
- `/launch/poly-ai` — Poly AI public contrast rows (not a reconstructed X creator wave)
- `/method` — collection notes, harness, `/work` fetch, non-claims
- `/data/launches.json` — 81-row ledger JSON
- `/APPLY.md` — Technical Generalist memo (same as repo-root `APPLY.md`)

## Run the app

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + Vite; also GET sociallcapital.com/work
npm run preview
```

`npm run build` must pass. The build copies `data/` into `dist/data/`.

## Run the harness (required for the S-shaped claim)

The ledger alone is item-3 (A-tier: text tool over a complex public corpus). **S-tier here is the harness**: specialised, connects to more than one external **JSON/oEmbed API** (HTML scrape does not count).

```bash
npm run harness              # live publish.x.com oEmbed + FixTweet + Microlink; skip official X if no token
npm run harness:offline      # fixtures only
node harness/run.mjs --apply # merge official X public_metrics into data/launches.json (needs bearer)
```

Env (copy `.env.example` → `.env`; never commit secrets):

| Variable | Used for |
|----------|----------|
| `X_BEARER_TOKEN` | Official X API v2 `GET /2/tweets` |
| `PRODUCTHUNT_TOKEN` | Product Hunt GraphQL (counted). Without it, PH HTML is scrape-only and often 403 |
| `YOUTUBE_API_KEY` | Unused. YouTube path is oEmbed (no key). X posts use `publish.x.com/oembed`. |

Counted no-key APIs: `publish.x.com/oembed`, `api.fxtwitter.com`, `api.microlink.io`. Open Graph HTML parse is extra, not counted.

Docs: [`harness/README.md`](harness/README.md). Sample output: [`harness/fixtures/sample-run.json`](harness/fixtures/sample-run.json).

This VM often has **no live X bearer**. Code + fixtures ship so a reviewer with keys can run `--apply`. Unauthenticated dry-run still hits ≥2 **counted** APIs (`publish.x.com/oembed`, `api.fxtwitter.com`, `api.microlink.io`). HTML scrape does not count.

## Data

Source of truth: [`data/launches.json`](data/launches.json) (**81** rows). Keep [`public/data/launches.json`](public/data/launches.json) identical. Do not invent rows.

- 69 Wispr Flow rows (X-wave depth from `data/x-wave-arnav.json`)
- 12 Poly AI public contrast rows (`launch_key=poly_ai`, also copied at [`data/poly-contrast.json`](data/poly-contrast.json)) — see [`data/poly-reject.md`](data/poly-reject.md) for what was **not** reconstructed

Also in-repo:

- [`data/poly-contrast.json`](data/poly-contrast.json) — 12-row Poly AI contrast (same ids as `launch_key=poly_ai`)
- [`data/poly-reject.md`](data/poly-reject.md) — URLs/claims not added; Poly is not a Wispr-style X-wave dump
- [`data/x-wave-arnav.json`](data/x-wave-arnav.json) — 29-row X dump (x-wf-001..029)
- [`data/sources.md`](data/sources.md) — every URL in the ledger
- [`data/thesis-checkpoint.md`](data/thesis-checkpoint.md) — Insight A checkpoint
- [`INSIGHT.md`](INSIGHT.md) — pinned wording on `/`
- [`APPLY.md`](APPLY.md) — Technical Generalist memo (personal fields filled by Arnav; Why SoCap left blank). Do not email.

Schema (required unless marked optional):

`id`, `launch_key`, `client`, `date`, `datetime_utc`, `asset_type`, `platform`, `author_handle`, `author_name`, `author_type`, `followers_approx`, `is_video`, `hook_type`, `hook_text`, `posted_offset_hours`, `metrics`, `url`, `source_note`, `confidence` (`high` | `medium` | `low`), `socap_claimed` (boolean), `attribution_note`, `wave` (optional), `media_preview_url` (optional OG/X poster)

`launch_key` values: `wispr_flow`, `poly_ai`. Route slugs: `wispr-flow`, `poly-ai`.

`socap_claimed` is true only where the JSON flag is set from a **public** SoCap page, official/staff author, or a URL the SoCap work page actually features. Creators and unverified amplification stay false. Notes explain the evidence; they do not invent contracts.

## Add a row

1. Append one JSON object to `data/launches.json` **and** `public/data/launches.json`. Use `null` for unknown metrics, offsets, or follower counts.
2. Set `socap_claimed` + `attribution_note` from public evidence only (or run `npm run encode-attribution` then edit the note).
3. Paste the URL under “In launches.json” in `data/sources.md`.
4. Run `npm run build`. Confirm the row on `/` and that **open** hits the real URL.

Do not add a row without a public URL. Do not mark `confidence: high` without a primary source. Do not invent a SoCap contract for a creator quote.

## Insight A (pinned)

SoCap does not win launches by owning the biggest follower graph. On Wispr Flow’s Android drop, the scarce resource is draft capacity and taste QA: a stranger-hook hero film on an already-viral founder account, then voice-matched posts that share talking points without identical captions.

Falsify: identical captions ordered by follower count, or if `@socapinc` never claimed the launch.

Full text: `INSIGHT.md`.

## Known gaps

- Wispr X wave is reconstructed. Poly is **12 public contrast URLs**, not a creator-wave reconstruction (case/campaign/press/LinkedIn).
- Wispr hero metrics on the ledger are **SoCap work-page embed only** (10.8K likes / 4.5K replies). Views/reposts/bookmarks stay null.
- Medium/low creator rows are launch-adjacent; unpaid vs contracted is unproven unless `socap_claimed` is true.
- `followers_approx` is often null — cannot test follower-rank order from this file alone.
- No YouTube URLs in JSON; oEmbed is wired and stays quiet until a row has a YouTube URL.
- Harness `--apply` needs `X_BEARER_TOKEN`; without it, X metrics stay as last public dump / fixture.

## Non-claims

- Not affiliated with SoCap, Wispr Flow, PolyAI, or listed authors.
- Not a complete history of every Wispr or Poly mention on the internet.
- Not proof that every quote-tweet was ghostwritten.
- Homepage “300M views/mo” is SoCap copy, not a per-row metric here.
- Why SoCap in APPLY.md is blank on purpose. No email.

## Deploy

Static files in `dist/`. SPA fallback: `vercel.json` / `netlify.toml` rewrite to `index.html` (JSON under `/data/` is not rewritten). GitHub Pages workflow builds with `VITE_BASE=/waveline-socap/`.

`APPLY.md` is copied to the site root as `/APPLY.md` (also linked from the header and footer).
