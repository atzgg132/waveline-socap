import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src/data/work-snapshot.json");
const URL = "https://www.sociallcapital.com/work";

const snapshot = {
  source_url: URL,
  fetched_at_utc: new Date().toISOString(),
  ok: false,
  http_status: null,
  title: null,
  heading: null,
  note: "Build-time fetch of sociallcapital.com/work did not complete.",
};

try {
  const res = await fetch(URL, {
    headers: { Accept: "text/html", "User-Agent": "waveline-socap-build/0.1" },
    redirect: "follow",
  });
  snapshot.http_status = res.status;
  const html = await res.text();
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? null;
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]
    ?.replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  snapshot.title = title;
  snapshot.heading = h1 ?? null;
  if (res.ok) {
    snapshot.ok = true;
    snapshot.note =
      "Build-time GET of /work succeeded. This is a fetch note, not a claim that the work index lists every client or every wave row.";
  } else {
    snapshot.note = `Build-time GET of /work returned HTTP ${res.status}.`;
  }
} catch (err) {
  snapshot.note = `Build-time GET of /work failed: ${err instanceof Error ? err.message : String(err)}`;
}

writeFileSync(OUT, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(snapshot.ok ? `work snapshot ok (${snapshot.http_status})` : `work snapshot failed: ${snapshot.note}`);
