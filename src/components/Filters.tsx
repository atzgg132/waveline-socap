import { uniqueValues } from "../ledger";
import type { LaunchRow, LedgerFilters } from "../types";

type Props = {
  rows: LaunchRow[];
  filters: LedgerFilters;
  onChange: (next: LedgerFilters) => void;
  includeWave?: boolean;
  defaultWave?: string;
};

export function Filters({
  rows,
  filters,
  onChange,
  includeWave = false,
  defaultWave = "",
}: Props) {
  const set = (key: keyof LedgerFilters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="filters">
      <Select
        label="launch_key"
        value={filters.launch_key}
        onChange={(v) => set("launch_key", v)}
        options={uniqueValues(rows, "launch_key")}
      />
      <Select
        label="platform"
        value={filters.platform}
        onChange={(v) => set("platform", v)}
        options={uniqueValues(rows, "platform")}
      />
      <Select
        label="author_type"
        value={filters.author_type}
        onChange={(v) => set("author_type", v)}
        options={uniqueValues(rows, "author_type")}
      />
      <Select
        label="asset_type"
        value={filters.asset_type}
        onChange={(v) => set("asset_type", v)}
        options={uniqueValues(rows, "asset_type")}
      />
      <Select
        label="is_video"
        value={filters.is_video}
        onChange={(v) => set("is_video", v)}
        options={["true", "false"]}
      />
      {includeWave ? (
        <label className="f">
          wave
          <select value={filters.wave} onChange={(e) => set("wave", e.target.value)}>
            <option value="">all</option>
            <option value="android-x-2026">android 2026 + X wave</option>
            {uniqueValues(rows, "wave").map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <Select
        label="socap_claimed"
        value={filters.socap_claimed}
        onChange={(v) => set("socap_claimed", v)}
        options={["true", "false"]}
      />
      <button
        type="button"
        className="reset"
        onClick={() =>
          onChange({
            launch_key: "",
            platform: "",
            author_type: "",
            asset_type: "",
            is_video: "",
            wave: defaultWave,
            socap_claimed: "",
          })
        }
      >
        Reset
      </button>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="f">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">all</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
