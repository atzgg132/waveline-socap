# Sources

Public pages only. No private rates, leaked decks, or invented posts/metrics.
Corpus companion to `data/launches.json`. Low-confidence or unverifiable candidates go to `rejected.md`.

## Seed URLs

| URL | Used for |
|-----|----------|
| https://sociallcapital.com/work/wispr-flow | Wispr Flow depth seed; X embed + case page rows |
| https://sociallcapital.com/work/poly-ai | Optional contrast client; X embed + case page rows |

## Stub rows (verified against public pages, 2026-09-15)

| id | How verified |
|----|----------------|
| `wf-android-tankots-2026-02-23` | SoCap Wispr Flow work page embeds Tanay Kothari X post (5:09 PM · Feb 23, 2026). likes/comments from page chrome; views not shown → `null`. Direct `x.com` URL not captured. |
| `wf-case-socap-2026-02` | Official SoCap case page itself. |
| `poly-raise-polyaivoice-2026-02-17` | SoCap Poly AI work page embeds @polyaivoice X post (3:59 PM · Feb 17, 2026). likes/comments from page chrome; views `null`. Contrast client. |
| `poly-case-socap-2026-02` | Official SoCap Poly AI case page. |
| `wf-linkedin-label-socap-2026-02` | LinkedIn appears as a channel label on the Wispr case chrome. **Not a captured post.** `confidence: medium`. Corpus should replace with a real LinkedIn URL or move to `rejected.md`. |

## Rules

- Metrics are integers only when visible on the public page; otherwise `null` (rendered as — in the app).
- Do not copy company-level view claims (~500M, >300M/mo) onto a row.
- Influencer posts require a public URL. Named-creator claims without URLs are rejected.
