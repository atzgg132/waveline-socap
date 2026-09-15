import type { FilterState } from "../lib/filters";
import { filtersActive } from "../lib/filters";
import type { LaunchRow } from "../types";
import { uniqueProducts, uniqueValues } from "../lib/filters";

type Props = {
  rows: LaunchRow[];
  shown: number;
  filters: FilterState;
  onChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
};

export function FilterBar({ rows, shown, filters, onChange, onReset }: Props) {
  const products = uniqueProducts(rows);
  const platforms = uniqueValues(rows, "platform");
  const roles = uniqueValues(rows, "author_type");
  const waves = uniqueValues(rows, "wave");
  const confs = uniqueValues(rows, "confidence");

  return (
    <form
      className="toolbar"
      onSubmit={(e) => e.preventDefault()}
      aria-label="Ledger filters"
    >
      <div className="field">
        <label htmlFor="f-product">Product</label>
        <select
          id="f-product"
          value={filters.product}
          onChange={(e) => onChange("product", e.target.value)}
        >
          <option value="">All</option>
          {products.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-platform">Platform</label>
        <select
          id="f-platform"
          value={filters.platform}
          onChange={(e) => onChange("platform", e.target.value)}
        >
          <option value="">All</option>
          {platforms.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-role">Role</label>
        <select
          id="f-role"
          value={filters.role}
          onChange={(e) => onChange("role", e.target.value)}
        >
          <option value="">All</option>
          {roles.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-wave">Wave</label>
        <select
          id="f-wave"
          value={filters.wave}
          onChange={(e) => onChange("wave", e.target.value)}
        >
          <option value="">All</option>
          {waves.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-conf">Confidence</label>
        <select
          id="f-conf"
          value={filters.confidence}
          onChange={(e) => onChange("confidence", e.target.value)}
        >
          <option value="">All</option>
          {confs.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-from">From</label>
        <input
          id="f-from"
          type="date"
          value={filters.from}
          onChange={(e) => onChange("from", e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="f-to">To</label>
        <input
          id="f-to"
          type="date"
          value={filters.to}
          onChange={(e) => onChange("to", e.target.value)}
        />
      </div>
      <div className="toolbar-meta">
        <span>
          {shown} / {rows.length}
        </span>
        {filtersActive(filters) ? (
          <button type="button" onClick={onReset}>
            Reset
          </button>
        ) : null}
      </div>
    </form>
  );
}
