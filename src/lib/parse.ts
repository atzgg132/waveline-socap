import type { LaunchRow, Metrics } from "../types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asNullableString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value;
  return null;
}

function asNullableInt(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return null;
}

function parseMetrics(value: unknown): Metrics {
  if (!isRecord(value)) {
    return { views: null, likes: null, reposts: null, comments: null };
  }
  return {
    views: asNullableInt(value.views),
    likes: asNullableInt(value.likes),
    reposts: asNullableInt(value.reposts),
    comments: asNullableInt(value.comments),
  };
}

function parseRow(value: unknown): LaunchRow | null {
  if (!isRecord(value)) return null;
  const id = asString(value.id);
  const launch_key = asString(value.launch_key);
  const client = asString(value.client);
  const date = asString(value.date);
  const datetime_utc = asString(value.datetime_utc);
  const asset_type = asString(value.asset_type);
  const platform = asString(value.platform);
  const author_type = asString(value.author_type);
  const hook_type = asString(value.hook_type);
  const hook_text = asString(value.hook_text);
  const url = asString(value.url);
  const source_note = asString(value.source_note);
  const confidence = asString(value.confidence);
  if (
    !id ||
    !launch_key ||
    !client ||
    !date ||
    !datetime_utc ||
    !asset_type ||
    !platform ||
    !author_type ||
    !hook_type ||
    !hook_text ||
    !url ||
    !source_note ||
    !confidence
  ) {
    return null;
  }

  return {
    id,
    launch_key,
    client,
    date,
    datetime_utc,
    asset_type,
    platform,
    author_handle: asNullableString(value.author_handle),
    author_name: asNullableString(value.author_name),
    author_type,
    followers_approx: asNullableInt(value.followers_approx),
    is_video: value.is_video === true,
    hook_type,
    hook_text,
    posted_offset_hours: asNullableInt(value.posted_offset_hours),
    metrics: parseMetrics(value.metrics),
    url,
    source_note,
    confidence,
    wave: asNullableString(value.wave),
  };
}

export function parseLaunches(json: unknown): {
  rows: LaunchRow[];
  skipped: number;
} {
  if (!Array.isArray(json)) {
    throw new Error("launches.json must be a JSON array");
  }
  const rows: LaunchRow[] = [];
  let skipped = 0;
  const seen = new Set<string>();
  for (const item of json) {
    const row = parseRow(item);
    if (!row || seen.has(row.id)) {
      skipped += 1;
      continue;
    }
    seen.add(row.id);
    rows.push(row);
  }
  return { rows, skipped };
}
