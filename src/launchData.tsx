import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import bundledRaw from "../data/launches.json";
import { parseLaunches } from "./loadLaunches";
import type { LaunchesFetchNote, LaunchRow } from "./types";

const bundled = parseLaunches(bundledRaw);

export type LaunchData = {
  launches: LaunchRow[];
  dataFileEmpty: boolean;
  skippedInvalidCount: number;
  runtimeFetch: LaunchesFetchNote;
};

const LaunchDataContext = createContext<LaunchData | null>(null);

export function publicLaunchesUrl(): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.endsWith("/") ? base : `${base}/`}data/launches.json`;
}

export function LaunchDataProvider({ children }: { children: ReactNode }) {
  const [parsed, setParsed] = useState(bundled);
  const [runtimeFetch, setRuntimeFetch] = useState<LaunchesFetchNote>(() => ({
    source_url: publicLaunchesUrl(),
    fetched_at_utc: null,
    ok: false,
    http_status: null,
    row_count: null,
    used_for_ledger: false,
    note: "Runtime GET of /data/launches.json has not finished.",
  }));

  useEffect(() => {
    const url = publicLaunchesUrl();
    const ctrl = new AbortController();
    fetch(url, { signal: ctrl.signal, headers: { Accept: "application/json" } })
      .then(async (res) => {
        const fetched_at_utc = new Date().toISOString();
        const text = await res.text();
        let data: unknown;
        try {
          data = JSON.parse(text);
        } catch {
          setRuntimeFetch({
            source_url: url,
            fetched_at_utc,
            ok: false,
            http_status: res.status,
            row_count: null,
            used_for_ledger: false,
            note: `Runtime GET of /data/launches.json returned non-JSON (HTTP ${res.status}). Ledger stays on bundled file.`,
          });
          return;
        }
        const next = parseLaunches(data);
        if (res.ok && next.launches.length > 0) {
          setParsed(next);
          setRuntimeFetch({
            source_url: url,
            fetched_at_utc,
            ok: true,
            http_status: res.status,
            row_count: next.launches.length,
            used_for_ledger: true,
            note: `Runtime GET of /data/launches.json succeeded (${next.launches.length} valid rows).`,
          });
          return;
        }
        setRuntimeFetch({
          source_url: url,
          fetched_at_utc,
          ok: res.ok,
          http_status: res.status,
          row_count: next.launches.length,
          used_for_ledger: false,
          note: "Runtime GET of /data/launches.json did not yield usable rows. Ledger stays on bundled file.",
        });
      })
      .catch((err: unknown) => {
        if (ctrl.signal.aborted) return;
        setRuntimeFetch({
          source_url: url,
          fetched_at_utc: new Date().toISOString(),
          ok: false,
          http_status: null,
          row_count: null,
          used_for_ledger: false,
          note: `Runtime GET of /data/launches.json failed (${err instanceof Error ? err.message : "error"}). Ledger stays on bundled file.`,
        });
      });
    return () => ctrl.abort();
  }, []);

  const value = useMemo<LaunchData>(
    () => ({
      launches: parsed.launches,
      dataFileEmpty: parsed.dataFileEmpty,
      skippedInvalidCount: parsed.skippedInvalidCount,
      runtimeFetch,
    }),
    [parsed, runtimeFetch],
  );

  return <LaunchDataContext.Provider value={value}>{children}</LaunchDataContext.Provider>;
}

export function useLaunchData(): LaunchData {
  const ctx = useContext(LaunchDataContext);
  if (!ctx) throw new Error("useLaunchData must be used within LaunchDataProvider");
  return ctx;
}
