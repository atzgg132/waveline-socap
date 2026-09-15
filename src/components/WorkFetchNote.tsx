import { useEffect, useState } from "react";
import snapshot from "../data/work-snapshot.json";
import type { WorkSnapshot } from "../types";

const buildSnapshot = snapshot as WorkSnapshot;

export function WorkFetchNote() {
  const [runtime, setRuntime] = useState<WorkSnapshot | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("https://www.sociallcapital.com/work", { signal: ctrl.signal })
      .then(async (res) => {
        const text = await res.text();
        const title = text.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? null;
        setRuntime({
          source_url: "https://www.sociallcapital.com/work",
          fetched_at_utc: new Date().toISOString(),
          ok: res.ok,
          http_status: res.status,
          title,
          heading: null,
          note: res.ok
            ? "Runtime GET of /work succeeded in this browser."
            : `Runtime GET of /work returned HTTP ${res.status}.`,
        });
      })
      .catch((err: unknown) => {
        setRuntime({
          source_url: "https://www.sociallcapital.com/work",
          fetched_at_utc: new Date().toISOString(),
          ok: false,
          http_status: null,
          title: null,
          heading: null,
          note: `Runtime GET blocked or failed (${err instanceof Error ? err.message : "error"}). Build snapshot below still applies.`,
        });
      });
    return () => ctrl.abort();
  }, []);

  return (
    <div className="note">
      <strong>sociallcapital.com/work fetch note.</strong>
      <p>
        Build: {buildSnapshot.ok ? "ok" : "failed"}
        {buildSnapshot.http_status != null ? ` HTTP ${buildSnapshot.http_status}` : ""} —{" "}
        {buildSnapshot.note}
        {buildSnapshot.title ? ` Title: ${buildSnapshot.title}.` : ""}
      </p>
      <p>
        Runtime: {runtime ? (runtime.ok ? "ok" : "failed") : "trying…"}
        {runtime?.http_status != null ? ` HTTP ${runtime.http_status}` : ""} —{" "}
        {runtime?.note ?? ""}
        {runtime?.title ? ` Title: ${runtime.title}.` : ""}
      </p>
      <p>
        Source:{" "}
        <a href="https://www.sociallcapital.com/work" target="_blank" rel="noreferrer">
          https://www.sociallcapital.com/work
        </a>
      </p>
    </div>
  );
}
