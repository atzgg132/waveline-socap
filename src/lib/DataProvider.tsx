import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LaunchRow } from "../types";
import { parseLaunches } from "./parse";

export type DataState = {
  rows: LaunchRow[];
  skipped: number;
  status: "loading" | "ready" | "error";
  error: string | null;
};

const DataContext = createContext<DataState | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DataState>({
    rows: [],
    skipped: 0,
    status: "loading",
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/data/launches.json", { cache: "no-cache" })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} loading /data/launches.json`);
        const json: unknown = await res.json();
        const parsed = parseLaunches(json);
        if (!cancelled) {
          setState({
            rows: parsed.rows,
            skipped: parsed.skipped,
            status: "ready",
            error: null,
          });
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            rows: [],
            skipped: 0,
            status: "error",
            error: err instanceof Error ? err.message : "Failed to load launches.json",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => state, [state]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useLaunches(): DataState {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useLaunches must be used within DataProvider");
  return ctx;
}
