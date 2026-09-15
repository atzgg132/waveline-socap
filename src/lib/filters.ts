import type { LaunchRow } from "../types";

export type FilterState = {
  product: string;
  platform: string;
  role: string;
  wave: string;
  confidence: string;
  from: string;
  to: string;
};

export const FILTER_KEYS = [
  "product",
  "platform",
  "role",
  "wave",
  "confidence",
  "from",
  "to",
] as const;

export const EMPTY_FILTERS: FilterState = {
  product: "",
  platform: "",
  role: "",
  wave: "",
  confidence: "",
  from: "",
  to: "",
};

export function readFilters(params: URLSearchParams): FilterState {
  return {
    product: params.get("product") ?? "",
    platform: params.get("platform") ?? "",
    role: params.get("role") ?? "",
    wave: params.get("wave") ?? "",
    confidence: params.get("confidence") ?? "",
    from: params.get("from") ?? "",
    to: params.get("to") ?? "",
  };
}

export function writeFilters(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = filters[key].trim();
    if (value) params.set(key, value);
  }
  return params;
}

export function filtersActive(filters: FilterState): boolean {
  return FILTER_KEYS.some((key) => filters[key].trim() !== "");
}

function rowTime(row: LaunchRow): number {
  const t = Date.parse(row.datetime_utc);
  if (!Number.isNaN(t)) return t;
  return Date.parse(`${row.date}T00:00:00Z`);
}

export function applyFilters(
  rows: LaunchRow[],
  filters: FilterState,
): LaunchRow[] {
  const product = filters.product.trim().toLowerCase();
  const platform = filters.platform.trim();
  const role = filters.role.trim();
  const wave = filters.wave.trim();
  const confidence = filters.confidence.trim();
  const from = filters.from.trim();
  const to = filters.to.trim();
  const fromMs = from ? Date.parse(`${from}T00:00:00Z`) : NaN;
  const toMs = to ? Date.parse(`${to}T23:59:59.999Z`) : NaN;

  return rows.filter((row) => {
    if (product) {
      const hit =
        row.launch_key.toLowerCase() === product ||
        row.client.toLowerCase() === product;
      if (!hit) return false;
    }
    if (wave && row.wave !== wave && row.launch_key !== wave) return false;
    if (platform && row.platform !== platform) return false;
    if (role && row.author_type !== role) return false;
    if (confidence && row.confidence !== confidence) return false;
    if (from || to) {
      const t = rowTime(row);
      if (Number.isNaN(t)) return false;
      if (!Number.isNaN(fromMs) && t < fromMs) return false;
      if (!Number.isNaN(toMs) && t > toMs) return false;
    }
    return true;
  });
}

export function sortLedger(rows: LaunchRow[]): LaunchRow[] {
  return [...rows].sort((a, b) => {
    const dt = rowTime(b) - rowTime(a);
    if (dt !== 0) return dt;
    return a.id.localeCompare(b.id);
  });
}

export function sortChronological(rows: LaunchRow[]): LaunchRow[] {
  return [...rows].sort((a, b) => {
    const dt = rowTime(a) - rowTime(b);
    if (dt !== 0) return dt;
    const ao = a.posted_offset_hours;
    const bo = b.posted_offset_hours;
    if (ao !== null && bo !== null && ao !== bo) return ao - bo;
    if (ao === null && bo !== null) return 1;
    if (ao !== null && bo === null) return -1;
    return a.id.localeCompare(b.id);
  });
}

export function uniqueProducts(
  rows: LaunchRow[],
): { key: string; label: string }[] {
  const map = new Map<string, string>();
  for (const row of rows) {
    if (!map.has(row.launch_key)) map.set(row.launch_key, row.client);
  }
  return [...map.entries()]
    .map(([key, label]) => ({ key, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function uniqueValues(
  rows: LaunchRow[],
  field: "platform" | "author_type" | "launch_key" | "confidence" | "wave",
): string[] {
  const values = rows
    .map((row) => row[field])
    .filter((v): v is string => typeof v === "string" && v.length > 0);
  return [...new Set(values)].sort();
}
