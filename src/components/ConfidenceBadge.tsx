import type { Confidence } from "../types";

export function ConfidenceBadge({ value }: { value: Confidence }) {
  if (value === "high") return <span className="mono">{value}</span>;
  return <span className={`badge ${value}`}>{value}</span>;
}
