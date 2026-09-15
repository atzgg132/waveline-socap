#!/usr/bin/env node
/**
 * Waveline multi-API harness.
 *
 * External APIs / apps (always more than one; keys optional):
 *   1. X API v2  GET /2/tweets          — metrics + media_keys (needs X_BEARER_TOKEN)
 *   2. oEmbed    YouTube + publish.x.com — title/author/html (no key)
 *   3. Open Graph HTTP GET + meta parse — og:title / og:image from live pages
 *   4. Product Hunt GraphQL or public HTML product page
 *
 *   node harness/run.mjs --dry-run      # live unauthenticated APIs; skip X if no token
 *   node harness/run.mjs --offline      # fixtures only
 *   node harness/run.mjs --apply        # merge X public_metrics into data/launches.json
 *
 * Never prints secrets. Does not email. Does not invent metrics.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "harness/out");
const FIXTURE_DIR = join(ROOT, "harness/fixtures");
const LAUNCHES = join(ROOT, "data/launches.json");

const args = new Set(process.argv.slice(2));
const DRY = args.has("--dry-run") || !args.has("--apply");
const OFFLINE = args.has("--offline");
const APPLY = args.has("--apply") && !DRY;
const WRITE_FIXTURES = args.has("--write-fixtures");
const limitFlag = process.argv.find((a, i, all) => all[i - 1] === "--limit");
const LIMIT = limitFlag ? Number(limitFlag) : 40;

loadDotEnv(join(ROOT, ".env"));

const X_BEARER = process.env.X_BEARER_TOKEN || "";
const PH_TOKEN = process.env.PRODUCTHUNT_TOKEN || "";

const started = new Date().toISOString();
const report = {
  started,
  mode: OFFLINE ? "offline" : APPLY ? "apply" : "dry-run",
  apis: {
    x_api_v2: { used: false, skipped: true, reason: "no token or offline" },
    oembed: { used: false, skipped: true, reason: "" },
    open_graph: { used: false, skipped: true, reason: "" },
    product_hunt: { used: false, skipped: true, reason: "" },
  },
  rows_scanned: 0,
  x_ids: [],
  x_metrics: [],
  oembed: [],
  open_graph: [],
  product_hunt: null,
  warnings: [],
};

const rows = JSON.parse(readFileSync(LAUNCHES, "utf8"));
report.rows_scanned = rows.length;

const xIds = unique(
  rows
    .map((r) => tweetIdFromUrl(r.url))
    .filter(Boolean),
).slice(0, LIMIT);

report.x_ids = xIds;

if (OFFLINE) {
  const xFix = readFixture("x-lookup.json", "offline fixture");
  report.x_metrics = xFix.sample || [];
  report.oembed = readFixture("oembed.json", "offline fixture").items || [];
  report.open_graph = readFixture("open-graph.json", "offline fixture").items || [];
  report.product_hunt = readFixture("product-hunt.json", "offline fixture");
  report.apis.oembed = { used: true, skipped: false, reason: "fixture" };
  report.apis.open_graph = { used: true, skipped: false, reason: "fixture" };
  report.apis.product_hunt = { used: true, skipped: false, reason: "fixture" };
  report.apis.x_api_v2 = {
    used: true,
    skipped: false,
    reason: "fixture",
    live: false,
  };
} else {
  if (X_BEARER) {
    const x = await lookupX(xIds, X_BEARER);
    report.apis.x_api_v2 = x.meta;
    report.x_metrics = x.metrics;
  } else {
    report.apis.x_api_v2 = {
      used: false,
      skipped: true,
      reason: "X_BEARER_TOKEN unset — dry-run skips live X. Reviewer: set token and rerun.",
    };
    report.warnings.push("X API skipped (no bearer). oEmbed + Open Graph + Product Hunt still run.");
  }

  const oembedTargets = pickOembedTargets(rows);
  report.oembed = [];
  for (const url of oembedTargets) {
    report.oembed.push(await fetchOembed(url));
  }
  report.apis.oembed = {
    used: report.oembed.some((x) => x.ok),
    skipped: false,
    reason: `GET youtube.com/oembed and publish.x.com/oembed for ${oembedTargets.length} URLs`,
  };

  const ogTargets = pickOgTargets(rows);
  report.open_graph = [];
  for (const url of ogTargets) {
    report.open_graph.push(await fetchOpenGraph(url));
  }
  report.apis.open_graph = {
    used: report.open_graph.some((x) => x.ok),
    skipped: false,
    reason: `HTTP GET + og: meta parse for ${ogTargets.length} pages`,
  };

  const phUrl = rows.find((r) => /producthunt\.com/.test(r.url))?.url;
  report.product_hunt = await fetchProductHunt(phUrl, PH_TOKEN);
  report.apis.product_hunt = {
    used: Boolean(report.product_hunt?.ok),
    skipped: false,
    reason: PH_TOKEN
      ? "Product Hunt GraphQL api.producthunt.com/v2/api/graphql"
      : "public HTML GET of producthunt.com/products/wisprflow (no token)",
  };
}

mkdirSync(OUT_DIR, { recursive: true });
const outPath = join(OUT_DIR, "last-run.json");
writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);

if (WRITE_FIXTURES) {
  mkdirSync(FIXTURE_DIR, { recursive: true });
  const xLookupPath = join(FIXTURE_DIR, "x-lookup.json");
  const xPayload = existsSync(xLookupPath)
    ? JSON.parse(readFileSync(xLookupPath, "utf8"))
    : { sample: [] };
  if (report.x_metrics.length) xPayload.sample = report.x_metrics;
  xPayload.ok = true;
  xPayload.live = Boolean(X_BEARER) && !OFFLINE;
  xPayload.reason = report.x_metrics.length
    ? report.apis.x_api_v2.reason
    : xPayload.reason || "public corpus metrics; live X skipped without X_BEARER_TOKEN";
  writeFileSync(xLookupPath, `${JSON.stringify(xPayload, null, 2)}\n`);
  writeFileSync(
    join(FIXTURE_DIR, "oembed.json"),
    `${JSON.stringify({ items: report.oembed }, null, 2)}\n`,
  );
  writeFileSync(
    join(FIXTURE_DIR, "open-graph.json"),
    `${JSON.stringify({ items: report.open_graph }, null, 2)}\n`,
  );
  writeFileSync(
    join(FIXTURE_DIR, "product-hunt.json"),
    `${JSON.stringify(report.product_hunt, null, 2)}\n`,
  );
  writeFileSync(join(FIXTURE_DIR, "sample-run.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log("wrote harness/fixtures/* from this run");
}

if (APPLY && report.x_metrics.length) {
  const byId = new Map(report.x_metrics.map((m) => [m.id, m]));
  let changed = 0;
  for (const row of rows) {
    const id = tweetIdFromUrl(row.url);
    const m = id && byId.get(id);
    if (!m) continue;
    row.metrics = row.metrics || {};
    if (m.views != null) row.metrics.views = m.views;
    if (m.likes != null) row.metrics.likes = m.likes;
    if (m.replies != null) {
      row.metrics.replies = m.replies;
      row.metrics.comments = m.replies;
    }
    if (m.reposts != null) row.metrics.reposts = m.reposts;
    if (m.bookmarks != null) row.metrics.bookmarks = m.bookmarks;
    if (m.preview_image_url) row.media_preview_url = m.preview_image_url;
    changed += 1;
  }
  writeFileSync(LAUNCHES, `${JSON.stringify(rows, null, 2)}\n`);
  console.log(`applied X metrics to ${changed} rows in data/launches.json`);
} else if (APPLY) {
  report.warnings.push("--apply requested but no X metrics to merge.");
}

console.log(
  JSON.stringify(
    {
      mode: report.mode,
      apis: Object.fromEntries(
        Object.entries(report.apis).map(([k, v]) => [k, { used: v.used, skipped: v.skipped, reason: v.reason }]),
      ),
      x_ids: xIds.length,
      oembed_ok: report.oembed.filter((x) => x.ok).length,
      og_ok: report.open_graph.filter((x) => x.ok).length,
      product_hunt_ok: Boolean(report.product_hunt?.ok),
      out: "harness/out/last-run.json",
      warnings: report.warnings,
    },
    null,
    2,
  ),
);

function loadDotEnv(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 1) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}

function unique(list) {
  return [...new Set(list)];
}

function tweetIdFromUrl(url) {
  const m = String(url || "").match(/(?:x\.com|twitter\.com)\/[^/]+\/status\/(\d+)/);
  return m ? m[1] : null;
}

function pickOembedTargets(all) {
  const yt = all.filter((r) => /youtu\.?be/.test(r.url)).map((r) => r.url);
  const hero = all
    .filter(
      (r) =>
        r.url.includes("2025981424470479008") || r.url.includes("2023789465509015972"),
    )
    .map((r) => r.url);
  const x = all
    .filter((r) => /(?:x\.com|twitter\.com)\/[^/]+\/status\//.test(r.url))
    .map((r) => r.url);
  return unique([...yt, ...hero, ...x]).slice(0, 6);
}

function pickOgTargets(all) {
  const prefer = all.filter((r) =>
    /sociallcapital\.com|producthunt\.com|wisprflow\.ai|poly\.ai|techcrunch\.com/.test(r.url),
  );
  return unique(prefer.map((r) => r.url)).slice(0, 8);
}

async function lookupX(ids, token) {
  const meta = { used: false, skipped: true, reason: "" };
  if (!ids.length) {
    meta.reason = "no X status ids in corpus";
    return { meta, metrics: [] };
  }
  const chunk = ids.slice(0, 100);
  const params = new URLSearchParams({
    ids: chunk.join(","),
    "tweet.fields": "public_metrics,created_at,attachments",
    expansions: "attachments.media_keys",
    "media.fields": "preview_image_url,url,type,media_key",
  });
  const res = await fetch(`https://api.x.com/2/tweets?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    meta.reason = `X API HTTP ${res.status}`;
    return { meta, metrics: [] };
  }
  meta.used = true;
  meta.skipped = false;
  meta.reason = `GET api.x.com/2/tweets ids=${chunk.length}`;
  const media = new Map();
  for (const m of body.includes?.media || []) {
    media.set(m.media_key, m);
  }
  const metrics = (body.data || []).map((t) => {
    const pm = t.public_metrics || {};
    const key = t.attachments?.media_keys?.[0];
    const med = key ? media.get(key) : null;
    return {
      id: t.id,
      views: pm.impression_count ?? null,
      likes: pm.like_count ?? null,
      replies: pm.reply_count ?? null,
      reposts: pm.retweet_count ?? null,
      bookmarks: pm.bookmark_count ?? null,
      media_key: key || null,
      preview_image_url: med?.preview_image_url || med?.url || null,
    };
  });
  return { meta, metrics };
}

async function fetchOembed(url) {
  const yt = /youtu\.?be/.test(url);
  const x = /(?:x\.com|twitter\.com)\/[^/]+\/status\//.test(url);
  const endpoint = yt
    ? `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    : x
      ? `https://publish.x.com/oembed?url=${encodeURIComponent(url)}`
      : `https://noembed.com/embed?url=${encodeURIComponent(url)}`;
  const api = yt ? "youtube.com/oembed" : x ? "publish.x.com/oembed" : "noembed.com/embed";
  try {
    const res = await fetch(endpoint, { headers: { Accept: "application/json" } });
    const data = res.ok ? await res.json() : null;
    const useful = Boolean(
      data && !data.error && (data.title || data.author_name || data.html || data.thumbnail_url),
    );
    return {
      ok: Boolean(res.ok && useful),
      api,
      url,
      http_status: res.status,
      title: data?.title ?? null,
      thumbnail_url: data?.thumbnail_url ?? null,
      author_name: data?.author_name ?? null,
      html: data?.html ? String(data.html).slice(0, 280) : null,
    };
  } catch (err) {
    return { ok: false, api, url, error: String(err) };
  }
}

async function fetchOpenGraph(url) {
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "text/html",
        "User-Agent":
          "Mozilla/5.0 (compatible; WavelineHarness/0.1; +https://github.com/atzgg132/waveline-socap)",
      },
      redirect: "follow",
    });
    const html = await res.text();
    const og = (prop) => {
      const re = new RegExp(
        `<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`,
        "i",
      );
      const re2 = new RegExp(
        `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`,
        "i",
      );
      return html.match(re)?.[1] || html.match(re2)?.[1] || null;
    };
    const title =
      og("og:title") || html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() || null;
    return {
      ok: res.ok,
      api: "open_graph_http",
      url,
      http_status: res.status,
      title: decode(title),
      description: decode(og("og:description")),
      image: og("og:image"),
    };
  } catch (err) {
    return { ok: false, api: "open_graph_http", url, error: String(err) };
  }
}

async function fetchProductHunt(url, token) {
  const target = url || "https://www.producthunt.com/products/wisprflow";
  if (token) {
    try {
      const res = await fetch("https://api.producthunt.com/v2/api/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `{ product(slug: "wisprflow") { name votesCount tagline website } }`,
        }),
      });
      const json = await res.json().catch(() => ({}));
      return {
        ok: res.ok,
        api: "producthunt_graphql",
        url: target,
        http_status: res.status,
        data: json.data ?? json,
      };
    } catch (err) {
      return { ok: false, api: "producthunt_graphql", url: target, error: String(err) };
    }
  }
  try {
    const res = await fetch(target, {
      headers: {
        Accept: "text/html",
        "User-Agent":
          "Mozilla/5.0 (compatible; WavelineHarness/0.1; +https://github.com/atzgg132/waveline-socap)",
      },
    });
    const html = await res.text();
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() ?? null;
    return {
      ok: res.ok,
      api: "producthunt_html",
      url: target,
      http_status: res.status,
      title: decode(title),
    };
  } catch (err) {
    return { ok: false, api: "producthunt_html", url: target, error: String(err) };
  }
}

function decode(value) {
  if (!value) return null;
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function readFixture(name, reason) {
  const path = join(FIXTURE_DIR, name);
  if (!existsSync(path)) return { ok: false, reason: `missing ${name}` };
  const data = JSON.parse(readFileSync(path, "utf8"));
  return { ...data, reason, fixture: true };
}
