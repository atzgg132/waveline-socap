import type { LaunchRow } from "../types";
import {
  emdash,
  formatDateTime,
  formatMetric,
  offsetLabel,
} from "../lib/format";

export function Timeline({ rows }: { rows: LaunchRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="empty">
        No public rows for this launch_key in the current corpus.
      </p>
    );
  }

  return (
    <ol className="timeline">
      {rows.map((row) => {
        const unknown = row.posted_offset_hours === null;
        return (
          <li
            key={row.id}
            className={unknown ? "tl-item unknown" : "tl-item"}
          >
            <div className="tl-time">
              <span className="tl-offset">{offsetLabel(row.posted_offset_hours)}</span>
              <span>{formatDateTime(row.datetime_utc, row.date)}</span>
              <span>{row.id}</span>
            </div>
            <article className="tl-card">
              <h3>{row.hook_text}</h3>
              <div className="tl-meta">
                <span>
                  {emdash(row.author_name)} {emdash(row.author_handle)}
                </span>
                <span>
                  {row.author_type} · {row.platform} · {row.asset_type} ·{" "}
                  {row.hook_type}
                </span>
                <span className={row.confidence === "high" ? "conf-high" : "conf-medium"}>
                  {row.confidence}
                </span>
                {row.is_video ? <span className="tag on">video</span> : null}
              </div>
              <div className="tl-metrics">
                <div>
                  <span>Views</span>
                  <strong>{formatMetric(row.metrics.views)}</strong>
                </div>
                <div>
                  <span>Likes</span>
                  <strong>{formatMetric(row.metrics.likes)}</strong>
                </div>
                <div>
                  <span>Reposts</span>
                  <strong>{formatMetric(row.metrics.reposts)}</strong>
                </div>
                <div>
                  <span>Comments</span>
                  <strong>{formatMetric(row.metrics.comments)}</strong>
                </div>
              </div>
              <p className="note">{row.source_note}</p>
              <p className="note">
                Followers {formatMetric(row.followers_approx)} ·{" "}
                <a href={row.url} target="_blank" rel="noreferrer">
                  source
                </a>
              </p>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
