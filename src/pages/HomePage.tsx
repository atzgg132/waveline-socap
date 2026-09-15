import { useMemo, useState } from "react";
import { InsightPin } from "../components/InsightPin";
import { Filters } from "../components/Filters";
import { LedgerTable } from "../components/LedgerTable";
import { applyFilters, EMPTY_FILTERS } from "../ledger";
import { dataFileEmpty, launches, skippedInvalidCount } from "../loadLaunches";

export function HomePage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const visible = useMemo(() => applyFilters(launches, filters), [filters]);

  return (
    <>
      <InsightPin />
      {dataFileEmpty ? (
        <div className="note">
          <code>data/launches.json</code> is missing or an empty array. No rows invented. Add objects
          matching the schema, then rebuild.
        </div>
      ) : null}
      {skippedInvalidCount > 0 ? (
        <div className="note">Skipped {skippedInvalidCount} objects that failed schema checks.</div>
      ) : null}
      <Filters rows={launches} filters={filters} onChange={setFilters} includeWave />
      <p className="count">
        {visible.length} / {launches.length} rows
      </p>
      {visible.length === 0 ? (
        <div className="note">No rows match these filters.</div>
      ) : (
        <LedgerTable rows={visible} />
      )}
    </>
  );
}
