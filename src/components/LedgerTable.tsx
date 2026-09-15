import { Link } from "react-router-dom";
import { ConfidenceBadge } from "./ConfidenceBadge";
import {
  formatMetric,
  formatOffset,
  handleDisplay,
  repliesOf,
  slugFromLaunchKey,
} from "../ledger";
import type { LaunchRow } from "../types";

export function LedgerTable({ rows }: { rows: LaunchRow[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>date</th>
            <th>offset</th>
            <th>platform</th>
            <th>author</th>
            <th>name</th>
            <th>asset</th>
            <th>video</th>
            <th>views</th>
            <th>likes</th>
            <th>replies</th>
            <th>conf</th>
            <th className="hook">hook</th>
            <th>url</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="mono">{row.date}</td>
              <td className="mono">{formatOffset(row.posted_offset_hours)}</td>
              <td>{row.platform}</td>
              <td>
                {handleDisplay(row.author_handle)}
                <div className="mono" style={{ color: "#8a8a8a" }}>
                  {row.author_type}
                </div>
              </td>
              <td>{row.author_name}</td>
              <td>{row.asset_type}</td>
              <td>{row.is_video ? "yes" : "no"}</td>
              <td className="mono">{formatMetric(row.metrics.views)}</td>
              <td className="mono">{formatMetric(row.metrics.likes)}</td>
              <td className="mono">{formatMetric(repliesOf(row))}</td>
              <td>
                <ConfidenceBadge value={row.confidence} />
              </td>
              <td className="hook">{row.hook_text}</td>
              <td>
                <a href={row.url} target="_blank" rel="noreferrer">
                  open
                </a>
                {" · "}
                <Link to={`/launch/${slugFromLaunchKey(row.launch_key)}`}>launch</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
