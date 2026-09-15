import type { LaunchRow } from "./types";
import raw from "../data/launches.json";

const CONFIDENCE = new Set(["high", "medium", "low"]);

function isRow(value: unknown): value is LaunchRow {
  if (typeof value !== "object" || value === null) return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === "string" &&
    typeof row.launch_key === "string" &&
    typeof row.client === "string" &&
    typeof row.date === "string" &&
    typeof row.datetime_utc === "string" &&
    typeof row.asset_type === "string" &&
    typeof row.platform === "string" &&
    typeof row.author_handle === "string" &&
    typeof row.author_name === "string" &&
    typeof row.author_type === "string" &&
    typeof row.is_video === "boolean" &&
    typeof row.hook_type === "string" &&
    typeof row.hook_text === "string" &&
    typeof row.url === "string" &&
    typeof row.source_note === "string" &&
    typeof row.confidence === "string" &&
    CONFIDENCE.has(row.confidence) &&
    typeof row.metrics === "object" &&
    row.metrics !== null &&
    typeof row.socap_claimed === "boolean" &&
    typeof row.attribution_note === "string"
  );
}

export const DATA_FILE = "data/launches.json";

export function parseLaunches(rawData: unknown): {
  launches: LaunchRow[];
  dataFileEmpty: boolean;
  skippedInvalidCount: number;
} {
  const rows: unknown[] = Array.isArray(rawData) ? rawData : [];
  const launches = rows.filter(isRow);
  return {
    launches,
    dataFileEmpty: rows.length === 0,
    skippedInvalidCount: rows.length - launches.length,
  };
}

const bundled = parseLaunches(raw);
export const launches = bundled.launches;
export const dataFileEmpty = bundled.dataFileEmpty;
export const skippedInvalidCount = bundled.skippedInvalidCount;
