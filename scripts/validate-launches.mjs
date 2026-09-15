import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = join(ROOT, "data/launches.json");
const publicPath = join(ROOT, "public/data/launches.json");

const data = JSON.parse(readFileSync(dataPath, "utf8"));
const published = JSON.parse(readFileSync(publicPath, "utf8"));

if (!Array.isArray(data) || data.length !== 81) {
  throw new Error(`data/launches.json expected 81 rows, got ${Array.isArray(data) ? data.length : typeof data}`);
}
if (JSON.stringify(data) !== JSON.stringify(published)) {
  throw new Error("data/launches.json and public/data/launches.json differ");
}

const keys = new Set(data.map((row) => row.launch_key));
if (!keys.has("poly_ai") || !keys.has("wispr_flow")) {
  throw new Error(`launch_key set missing poly_ai or wispr_flow: ${[...keys].join(",")}`);
}

for (const row of data) {
  if (typeof row.socap_claimed !== "boolean") {
    throw new Error(`${row.id} socap_claimed is not boolean`);
  }
  if (typeof row.attribution_note !== "string" || row.attribution_note.length === 0) {
    throw new Error(`${row.id} missing attribution_note`);
  }
}

console.log(`validate-launches ok: ${data.length} rows; launch_keys=${[...keys].sort().join(",")}`);
