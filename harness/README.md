# Multi-API harness

Connects the ledger to **more than one** external JSON/oEmbed API. HTML page scrapes (Open Graph meta, Product Hunt HTML) are extra and **do not count** toward the S-shaped claim.

## Counted APIs

| Surface | Endpoint | Auth |
|---------|----------|------|
| oEmbed | `GET https://publish.x.com/oembed` and `GET https://www.youtube.com/oembed` | none |
| FixTweet | `GET https://api.fxtwitter.com/status/:id` | none |
| Microlink | `GET https://api.microlink.io/?url=` | none |
| X API v2 | `GET https://api.x.com/2/tweets` | `X_BEARER_TOKEN` |
| Product Hunt GraphQL | `POST https://api.producthunt.com/v2/api/graphql` | `PRODUCTHUNT_TOKEN` |

`--dry-run` (default) hits oEmbed + FixTweet + Microlink with no secrets. That is ≥2 live APIs.

`--apply` merges **official X API v2** `public_metrics` only. FixTweet numbers stay in the run report so a reviewer can compare; they are not written into the ledger unless you use official X. This avoids mixing unofficial counts into `data/launches.json`.

## Not counted (scrape)

Open Graph HTML parse and Product Hunt public HTML. Product Hunt HTML is often Cloudflare 403 from this VM.

## Env

Copy [`.env.example`](../.env.example) to `.env`. Never commit `.env`.

```
X_BEARER_TOKEN=          # Official X v2. Optional.
PRODUCTHUNT_TOKEN=       # PH GraphQL. Optional.
YOUTUBE_API_KEY=         # Unused; YouTube path is oEmbed.
```

## Run

```bash
npm run harness              # live unauthenticated APIs
npm run harness:offline      # fixtures only
node harness/run.mjs --dry-run --write-fixtures
node harness/run.mjs --apply                      # official X v2 merge (needs bearer)
```

Output: `harness/out/last-run.json` (gitignored). Committed sample: [`fixtures/sample-run.json`](fixtures/sample-run.json).

The console prints `counted_api_count` and `s_shaped` (true when ≥2 counted APIs were used).

## What this is not

- Not a live dashboard. `--apply` is opt-in and local.
- Not private creator rates or contracts.
- Not proof that every quote-tweet was ghostwritten.
