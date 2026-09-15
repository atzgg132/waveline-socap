import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FilterBar } from "../components/FilterBar";
import { InsightPin } from "../components/InsightPin";
import { LedgerTable } from "../components/LedgerTable";
import { useLaunches } from "../lib/DataProvider";
import {
  applyFilters,
  EMPTY_FILTERS,
  type FilterState,
  readFilters,
  sortLedger,
  writeFilters,
} from "../lib/filters";

export function HomePage() {
  const { rows, skipped, status, error } = useLaunches();
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => readFilters(params), [params]);

  const shown = useMemo(
    () => sortLedger(applyFilters(rows, filters)),
    [rows, filters],
  );

  const onChange = useCallback(
    (key: keyof FilterState, value: string) => {
      const next = { ...filters, [key]: value };
      setParams(writeFilters(next), { replace: true });
    },
    [filters, setParams],
  );

  const onReset = useCallback(() => {
    setParams(writeFilters(EMPTY_FILTERS), { replace: true });
  }, [setParams]);

  if (status === "loading") {
    return <p className="status">Loading ledger…</p>;
  }
  if (status === "error") {
    return <p className="status error">{error}</p>;
  }

  return (
    <>
      <InsightPin />
      {skipped > 0 ? (
        <p className="banner">{skipped} malformed row(s) skipped — not invented.</p>
      ) : null}
      <FilterBar
        rows={rows}
        shown={shown.length}
        filters={filters}
        onChange={onChange}
        onReset={onReset}
      />
      <LedgerTable rows={shown} />
    </>
  );
}
