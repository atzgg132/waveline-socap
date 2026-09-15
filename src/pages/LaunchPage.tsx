import { Link, useParams } from "react-router-dom";
import { Timeline } from "../components/Timeline";
import { useLaunches } from "../lib/DataProvider";
import { sortChronological } from "../lib/filters";
import { slugToLaunchKey } from "../lib/format";

export function LaunchPage() {
  const { slug = "" } = useParams();
  const key = slugToLaunchKey(slug);
  const { rows, status, error } = useLaunches();

  if (status === "loading") {
    return <p className="status">Loading timeline…</p>;
  }
  if (status === "error") {
    return <p className="status error">{error}</p>;
  }

  const slice = sortChronological(rows.filter((row) => row.launch_key === key));
  const client = slice[0]?.client ?? key;
  const isDepth = key === "wispr_flow";

  return (
    <>
      <p className="page-kicker">Depth timeline · launch_key = {key}</p>
      <h1 className="page-title">{client}</h1>
      <p className="page-lead">
        Chronological public rows only. T+ hours come from{" "}
        <code>posted_offset_hours</code> when present; T+? means the corpus did
        not record offset — not inferred. Metrics stay — when null.
      </p>
      {!isDepth ? (
        <p className="banner">
          Specified depth route is{" "}
          <Link to="/launch/wispr-flow">/launch/wispr-flow</Link>. This page is
          the same timeline shape for contrast keys present in the corpus.
        </p>
      ) : (
        <p className="banner">
          Wispr Flow depth. Waves include <code>wispr_flow_x</code> (X URLs in
          corpus). Filter the home ledger by wave to isolate a drop.
        </p>
      )}
      <Timeline rows={slice} />
    </>
  );
}
