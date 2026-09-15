export function emdash(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function trimNum(n: number): string {
  return n.toFixed(1).replace(/\.0$/, "");
}

/** Null/undefined → —. Never fabricates a count. */
export function formatMetric(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) {
    const m = n / 1_000_000;
    return `${m >= 10 ? trimNum(m) : trimNum(Number(m.toFixed(2)))}M`;
  }
  if (abs >= 1_000) return `${trimNum(n / 1_000)}k`;
  return String(n);
}

export function formatDateTime(iso: string, dateFallback: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return dateFallback || "—";
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  if (hh === "00" && mm === "00") return `${y}-${m}-${day}`;
  return `${y}-${m}-${day} ${hh}:${mm}Z`;
}

export function slugToLaunchKey(slug: string): string {
  return slug.replace(/-/g, "_");
}

export function launchKeyToSlug(key: string): string {
  return key.replace(/_/g, "-");
}

export function offsetLabel(hours: number | null): string {
  if (hours === null) return "T+?";
  if (hours === 0) return "T+0";
  if (hours > 0) return `T+${hours}h`;
  return `T${hours}h`;
}
