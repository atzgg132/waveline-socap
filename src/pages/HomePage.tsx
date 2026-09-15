import { useMemo } from "react";
import { InsightPin } from "../components/InsightPin";
import { Filters } from "../components/Filters";
import { LedgerTable } from "../components/LedgerTable";
import { applyFilters } from "../ledger";
import { useLaunchData } from "../launchData";
import { useLedgerFilters } from "../useLedgerFilters";

export function HomePage() {
  const { launches, dataFileEmpty, skippedInvalidCount, runtimeFetch } = useLaunchData();
  const { filters, onChange } = useLedgerFilters();
  const visible = useMemo(() => applyFilters(launches, filters), [launches, filters]);

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
      <Filters rows={launches} filters={filters} onChange={onChange} includeWave />
      <p className="count">
        {visible.length} / {launches.length} rows
      </p>
      <p className="count">
        runtime GET <code>/data/launches.json</code>
        {runtimeFetch.http_status != null ? ` HTTP ${runtimeFetch.http_status}` : ""}
        {runtimeFetch.row_count != null ? ` · ${runtimeFetch.row_count} rows` : ""}
        {runtimeFetch.ok ? " · ok" : runtimeFetch.fetched_at_utc ? " · fallback to bundled" : " · fetching…"}
      </p>
      {visible.length === 0 ? (
        <div className="note">No rows match these filters.</div>
      ) : (
        <LedgerTable rows={visible} />
      )}
    </>
  );
}
