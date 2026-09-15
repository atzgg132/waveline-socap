import { Link } from "react-router-dom";
import type { LaunchRow } from "../types";
import { emdash, formatDateTime, formatMetric, launchKeyToSlug } from "../lib/format";

export function LedgerTable({ rows }: { rows: LaunchRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="empty">
        No rows match these filters. Empty does not mean a wave had no posts.
      </p>
    );
  }

  return (
    <div className="table-wrap">
      <table className="ledger">
        <thead>
          <tr>
            <th>UTC</th>
            <th>Product</th>
            <th>Wave</th>
            <th>Plat</th>
            <th>Type</th>
            <th>Role</th>
            <th>Author</th>
            <th>Hook</th>
            <th>Vid</th>
            <th>Views</th>
            <th>Likes</th>
            <th>Reposts</th>
            <th>Cmts</th>
            <th>Conf</th>
            <th>Src</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="num">{formatDateTime(row.datetime_utc, row.date)}</td>
              <td>
                <Link to={`/launch/${launchKeyToSlug(row.launch_key)}`}>
                  {row.client}
                </Link>
              </td>
              <td>{row.wave ?? row.launch_key}</td>
              <td>{row.platform}</td>
              <td>{row.asset_type}</td>
              <td>{row.author_type}</td>
              <td className="author">
                {emdash(row.author_name)}
                <span className="handle">{emdash(row.author_handle)}</span>
              </td>
              <td className="hook" title={row.hook_text}>
                {row.hook_text}
              </td>
              <td>
                <span className={row.is_video ? "tag on" : "tag"}>
                  {row.is_video ? "yes" : "no"}
                </span>
              </td>
              <td className="num">{formatMetric(row.metrics.views)}</td>
              <td className="num">{formatMetric(row.metrics.likes)}</td>
              <td className="num">{formatMetric(row.metrics.reposts)}</td>
              <td className="num">{formatMetric(row.metrics.comments)}</td>
              <td className={row.confidence === "high" ? "conf-high" : "conf-medium"}>
                {row.confidence}
              </td>
              <td className="src">
                <a href={row.url} target="_blank" rel="noreferrer">
                  link
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
