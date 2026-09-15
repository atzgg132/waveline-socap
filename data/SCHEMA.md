# launches.json — LOCKED (CoS + Lead, 2026-09-15)

**Supersedes** earlier Lead draft fields (`product`/`wave`/`role`/…). Remap all rows to this shape.

Path: `/workspace/waveline/data/launches.json` → also commit to `https://github.com/atzgg132/waveline-socap` as `data/launches.json`.

Companion: `sources.md`, `rejected.md`.

## Slice
Influencers primary. Depth = Wispr Flow (`launch_key` / client wispr). Optional contrast = Poly AI. Public only. Never invent posts, views, creator ties, or quotes. Metrics null unless verified on the public page.

## Row shape (required)
```json
{
  "id": "wf-android-tankots-2026-02-23",
  "launch_key": "wispr_flow",
  "client": "Wispr Flow",
  "date": "2026-02-23",
  "datetime_utc": "2026-02-23T17:09:00Z",
  "asset_type": "post",
  "platform": "x",
  "author_handle": "@tankots",
  "author_name": "Tanay Kothari",
  "author_type": "founder",
  "followers_approx": null,
  "is_video": false,
  "hook_type": "stunt",
  "hook_text": "Short hook or paraphrase ≤240 chars; no fabricated quotes",
  "posted_offset_hours": 0,
  "metrics": { "views": null, "likes": null, "reposts": null, "comments": null },
  "url": "https://…",
  "source_note": "How verified; page context",
  "confidence": "high"
}
```

## Enums / conventions
- `launch_key`: snake product key — `wispr_flow`, `poly_ai`, `cartesia`, …
- `asset_type`: `post` | `thread` | `video` | `article` | `case_page` | `other`
- `platform`: `x` | `linkedin` | `producthunt` | `youtube` | `web` | `other`
- `author_type`: `influencer` | `founder` | `staff` | `official` | `press` | `unknown`
- `hook_type`: `stunt` | `demo` | `story` | `announce` | `playbook` | `other` | `unknown`
- `confidence`: `high` | `medium` (low → `rejected.md`)
- `followers_approx` / metric ints: only if publicly visible; else `null`
- `datetime_utc`: ISO-8601 when known; else date midnight UTC
- `posted_offset_hours`: hours after wave T0 if known; else `null`

## Caps
Non-influencer rows ≤30% of corpus except Wispr depth may include founder/staff/official/press as needed.
