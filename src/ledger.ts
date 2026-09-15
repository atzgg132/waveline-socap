import type { LaunchRow, LedgerFilters } from "./types";

export const HERO_STATUS_ID = "2025981424470479008";
export const POLY_HERO_STATUS_ID = "2023789465509015972";
export const HERO_URL = `https://x.com/tankots/status/${HERO_STATUS_ID}`;

export const EMPTY_FILTERS: LedgerFilters = {
  launch_key: "",
  platform: "",
  author_type: "",
  asset_type: "",
  is_video: "",
  wave: "",
  socap_claimed: "",
};

export const ANDROID_X_WAVES = new Set(["wispr_flow_x", "wispr-android-2026-02"]);

export function uniqueValues(rows: LaunchRow[], key: keyof LaunchRow): string[] {
  const values = new Set<string>();
  for (const row of rows) {
    const value = row[key];
    if (typeof value === "string" && value.length > 0) values.add(value);
  }
  return [...values].sort((a, b) => a.localeCompare(b));
}

export function applyFilters(rows: LaunchRow[], filters: LedgerFilters): LaunchRow[] {
  return rows.filter((row) => {
    if (filters.launch_key && row.launch_key !== filters.launch_key) return false;
    if (filters.platform && row.platform !== filters.platform) return false;
    if (filters.author_type && row.author_type !== filters.author_type) return false;
    if (filters.asset_type && row.asset_type !== filters.asset_type) return false;
    if (filters.is_video === "true" && row.is_video !== true) return false;
    if (filters.is_video === "false" && row.is_video !== false) return false;
    if (filters.socap_claimed === "true" && row.socap_claimed !== true) return false;
    if (filters.socap_claimed === "false" && row.socap_claimed !== false) return false;
    if (filters.wave === "android-x-2026") {
      if (!row.wave || !ANDROID_X_WAVES.has(row.wave)) return false;
    } else if (filters.wave && row.wave !== filters.wave) {
      return false;
    }
    return true;
  });
}

export function isT0Hero(row: LaunchRow): boolean {
  return (
    row.asset_type === "hero_video" ||
    row.url.includes(HERO_STATUS_ID) ||
    row.url.includes(POLY_HERO_STATUS_ID)
  );
}

export function sortTimeline(rows: LaunchRow[]): LaunchRow[] {
  const heroes = rows.filter(isT0Hero);
  const rest = rows.filter((row) => !isT0Hero(row));
  rest.sort(compareOffsetThenTime);
  heroes.sort(compareOffsetThenTime);
  return [...heroes, ...rest];
}

function compareOffsetThenTime(a: LaunchRow, b: LaunchRow): number {
  if (a.posted_offset_hours == null && b.posted_offset_hours == null) {
    return a.datetime_utc.localeCompare(b.datetime_utc) || a.id.localeCompare(b.id);
  }
  if (a.posted_offset_hours == null) return 1;
  if (b.posted_offset_hours == null) return -1;
  if (a.posted_offset_hours !== b.posted_offset_hours) {
    return a.posted_offset_hours - b.posted_offset_hours;
  }
  return a.datetime_utc.localeCompare(b.datetime_utc) || a.id.localeCompare(b.id);
}

export function formatMetric(value: number | null | undefined): string {
  if (value == null) return "—";
  if (Math.abs(value) >= 1_000_000) {
    const n = value / 1_000_000;
    return Number.isInteger(n) ? `${n}M` : `${n.toFixed(2)}M`.replace(/0+$/, "").replace(/\.$/, "");
  }
  if (Math.abs(value) >= 1_000) {
    const n = value / 1_000;
    const digits = n >= 100 ? 0 : 1;
    return `${n.toFixed(digits)}K`.replace(/\.0K$/, "K");
  }
  return String(value);
}

export function repliesOf(row: LaunchRow): number | null {
  const replies = row.metrics.replies;
  const comments = row.metrics.comments;
  if (replies != null) return replies;
  if (comments != null) return comments;
  return null;
}

export function formatOffset(hours: number | null): string {
  if (hours == null) return "null";
  if (hours === 0) return "T-0";
  const sign = hours > 0 ? "+" : "";
  if (Math.abs(hours) >= 24) {
    return `${sign}${hours}h`;
  }
  return `${sign}${hours}h`;
}

export function isYoutubeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    return host === "youtube.com" || host === "youtu.be" || host === "m.youtube.com";
  } catch {
    return false;
  }
}

export function slugFromLaunchKey(launchKey: string): string {
  return launchKey.replace(/_/g, "-");
}

export function launchKeyFromSlug(slug: string): string {
  return slug.replace(/-/g, "_");
}

export function handleDisplay(handle: string): string {
  const trimmed = handle.trim();
  if (!trimmed) return "—";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}
