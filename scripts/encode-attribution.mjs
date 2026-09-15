/**
 * Fill socap_claimed + attribution_note only when missing.
 * Does not overwrite Corpus packet notes. Does not invent metrics. Does not append rows.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const path = join(ROOT, "data/launches.json");
const rows = JSON.parse(readFileSync(path, "utf8"));

const WISPR_HERO = "2025981424470479008";
const POLY_HERO = "2023789465509015972";

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

let filled = 0;
for (const row of rows) {
  if (typeof row.socap_claimed === "boolean" && typeof row.attribution_note === "string") continue;
  Object.assign(row, attribution(row));
  filled += 1;
}

writeFileSync(path, `${JSON.stringify(rows, null, 2)}\n`);
const claimed = rows.filter((r) => r.socap_claimed).length;
const poly = rows.filter((r) => r.launch_key === "poly_ai").length;
console.log(`rows=${rows.length} filled_missing=${filled} socap_claimed=${claimed} poly_ai=${poly}`);
