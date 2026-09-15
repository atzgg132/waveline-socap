/**
 * Idempotent: encode socap_claimed + attribution_note on every ledger row,
 * append Poly AI public rows if missing. Public evidence only. Does not invent metrics.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const path = join(ROOT, "data/launches.json");
const rows = JSON.parse(readFileSync(path, "utf8"));

const WISPR_HERO = "2025981424470479008";
const POLY_HERO = "2023789465509015972";
const POLY_THUMB =
  "https://pbs.twimg.com/amplify_video_thumb/2023781188654022658/img/fP2-hA1kW0HMjrCc.jpg";

function attribution(row) {
  if (row.author_type === "socap_official") {
    return {
      socap_claimed: true,
      attribution_note:
        "SoCap official account. Public claim on this URL (Wispr: quote-tweet of the founder hero).",
    };
  }
  if (row.author_type === "socap_staff") {
    return {
      socap_claimed: true,
      attribution_note:
        "SoCap staff public post (Vedika). Attribution is the author, not a creator contract.",
    };
  }
  if (/sociallcapital\.com/i.test(row.url || "")) {
    return {
      socap_claimed: true,
      attribution_note: "SoCap work/site page. Company-claimed case, not a creator rate.",
    };
  }
  if (String(row.url || "").includes(WISPR_HERO)) {
    return {
      socap_claimed: true,
      attribution_note:
        "SoCap claimed this founder post via @socapinc QT (2026268845347164322). Founder-authored, not SoCap-authored.",
    };
  }
  if (row.id === "wf-android-vijay-bharadwaj-li-2026-02-23") {
    return {
      socap_claimed: true,
      attribution_note:
        "SoCap Head of Growth same-day LinkedIn amplification. Staff amp; not a creator contract or rate.",
    };
  }
  if (String(row.url || "").includes(POLY_HERO)) {
    return {
      socap_claimed: true,
      attribution_note:
        "Embedded as the hero on SoCap work/poly-ai. Client-authored post; SoCap-claimed via the work page.",
    };
  }
  return {
    socap_claimed: false,
    attribution_note: "No public SoCap tag or official claim on this URL.",
  };
}

for (const row of rows) {
  Object.assign(row, attribution(row));
  if (String(row.url || "").includes(POLY_HERO) && !row.media_preview_url) {
    row.media_preview_url = POLY_THUMB;
  }
}

const polyRows = [
  {
    id: "pa-x-polyaivoice-2023789465509015972",
    launch_key: "poly_ai",
    client: "PolyAI",
    date: "2026-02-17",
    datetime_utc: "2026-02-17T15:59:43.424Z",
    asset_type: "hero_video",
    platform: "x",
    author_handle: "polyaivoice",
    author_name: "PolyAI",
    author_type: "client_official",
    followers_approx: null,
    is_video: true,
    hook_type: "visual_stunt",
    hook_text:
      "PolyAI has raised $200M from Nvidia, Khosla Ventures, and multiple top VCs. We're one of the fastest-growing companies in the UK…",
    posted_offset_hours: 0,
    metrics: {
      views: null,
      likes: 4828,
      replies: 1500,
      comments: 1500,
      reposts: null,
      bookmarks: null,
    },
    url: `https://x.com/polyaivoice/status/${POLY_HERO}`,
    source_note:
      "Snowflake UTC 2026-02-17T15:59:43.424Z. favorite_count 4828 and conversation_count 1500 from the public react-tweet embed on sociallcapital.com/work/poly-ai (also shown as 4.8K likes / Read 1.5K replies). Views not exposed on the embed → null. Video poster stored as media_preview_url. Not a reconstructed creator wave.",
    confidence: "high",
    wave: null,
    socap_claimed: true,
    attribution_note:
      "Embedded as the hero on SoCap work/poly-ai. Client-authored post; SoCap-claimed via the work page.",
    media_preview_url: POLY_THUMB,
  },
  {
    id: "pa-web-socap-work",
    launch_key: "poly_ai",
    client: "PolyAI",
    date: "2026-02-17",
    datetime_utc: "2026-02-17T00:00:00Z",
    asset_type: "case_page",
    platform: "web",
    author_handle: "@sociallcapital",
    author_name: "Social Capital Inc",
    author_type: "official",
    followers_approx: null,
    is_video: false,
    hook_type: "case",
    hook_text: "SoCap work case: Poly AI (hero X embed on page, dated Feb 2026)",
    posted_offset_hours: null,
    metrics: {
      views: null,
      likes: null,
      reposts: null,
      comments: null,
    },
    url: "https://www.sociallcapital.com/work/poly-ai",
    source_note:
      "Public SoCap work page (heading month: Feb 2026). Embeds the PolyAI X hero. Calendar day aligned to the embedded tweet, not a verified page-publish timestamp. Creator-wave for Poly is not reconstructed — see data/poly-reject.md.",
    confidence: "high",
    wave: null,
    socap_claimed: true,
    attribution_note: "SoCap work case page for Poly AI.",
  },
  {
    id: "pa-web-polyai-blog-gordon-ramsay",
    launch_key: "poly_ai",
    client: "PolyAI",
    date: "2026-02-09",
    datetime_utc: "2026-02-09T00:00:00Z",
    asset_type: "article",
    platform: "web",
    author_handle: "poly.ai",
    author_name: "PolyAI",
    author_type: "client_official",
    followers_approx: null,
    is_video: false,
    hook_type: "announce",
    hook_text:
      "Gordon Ramsay applies his no-nonsense standards to customer service in PolyAI campaign",
    posted_offset_hours: null,
    metrics: {
      views: null,
      likes: null,
      reposts: null,
      comments: null,
    },
    url: "https://poly.ai/blog/gordon-ramsay-applies-his-no-nonsense-standards-to-customer-service-in-polyai-campaign",
    source_note:
      "Client blog by Mike Tague, 9 Feb 2026. Not SoCap-authored. Time-of-day not on the page → datetime is calendar-day. Offset vs T-0 hero left null (do not invent hours).",
    confidence: "high",
    wave: null,
    socap_claimed: false,
    attribution_note: "Client-authored campaign post. No SoCap byline on this URL.",
  },
];

const have = new Set(rows.map((r) => r.id));
for (const extra of polyRows) {
  if (!have.has(extra.id)) rows.push(extra);
}

writeFileSync(path, `${JSON.stringify(rows, null, 2)}\n`);
const claimed = rows.filter((r) => r.socap_claimed).length;
const poly = rows.filter((r) => r.launch_key === "poly_ai").length;
console.log(`rows=${rows.length} socap_claimed=${claimed} poly_ai=${poly}`);
