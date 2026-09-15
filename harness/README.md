# Multi-API harness

Connects the ledger to **more than one** external API/app. Item-3 (the static ledger) is the corpus; this directory is the specialised tool.

## APIs

| Surface | Endpoint | Auth |
|---------|----------|------|
| X API v2 | `GET https://api.x.com/2/tweets` (`public_metrics`, media keys / preview) | `X_BEARER_TOKEN` |
| oEmbed | `GET https://www.youtube.com/oembed` and `GET https://publish.x.com/oembed` | none |
| Open Graph | HTTP GET of live pages + `og:title` / `og:image` parse | none |
| Product Hunt | GraphQL `https://api.producthunt.com/v2/api/graphql` **or** public HTML GET of the product page | `PRODUCTHUNT_TOKEN` optional (public HTML is often Cloudflare-blocked) |

`--dry-run` (default) always attempts oEmbed + Open Graph + Product Hunt HTML. X is skipped until a bearer is set. That is still ≥2 live APIs with no secrets.

`--apply` merges X `public_metrics` into `data/launches.json` when the X call succeeded. It does **not** invent counts. It does **not** email anyone.

## Env

Copy [`.env.example`](../.env.example) to `.env`. Never commit `.env`.

```
X_BEARER_TOKEN=          # Developer Portal bearer. Optional.
PRODUCTHUNT_TOKEN=       # Optional. Without it, harness GETs public HTML.
YOUTUBE_API_KEY=         # Unused; YouTube path is oEmbed (no key).
```

## Run

```bash
npm run harness              # live unauthenticated APIs; skip X if no token
npm run harness:offline      # fixtures only (no network)
node harness/run.mjs --dry-run --write-fixtures   # refresh fixtures from live calls
node harness/run.mjs --apply                      # merge X metrics (needs bearer)
```

Output: `harness/out/last-run.json` (gitignored). Committed sample: [`fixtures/sample-run.json`](fixtures/sample-run.json).

## Fixtures

| File | What |
|------|------|
| `fixtures/x-lookup.json` | Shape of X metric rows. Seeded from public corpus/embed until a reviewer runs with a bearer. |
| `fixtures/oembed.json` | Last captured oEmbed titles/thumbnails |
| `fixtures/open-graph.json` | Last captured OG title/image |
| `fixtures/product-hunt.json` | Last captured PH HTML or GraphQL payload |
| `fixtures/sample-run.json` | Full dry-run report for reviewers without keys |

## What this is not

- Not a live dashboard. `--apply` is opt-in and local.
- Not private creator rates or contracts.
- Not proof that every quote-tweet was ghostwritten.
