import { WorkFetchNote } from "../components/WorkFetchNote";
import { launches } from "../loadLaunches";
import { SOCAP_SOURCES } from "../insight";

export function MethodPage() {
  const xRows = launches.filter((row) => row.platform === "x").length;
  const youtubeRows = launches.filter((row) => /youtu\.?be/.test(row.url)).length;
  const polyRows = launches.filter((row) => row.launch_key === "poly_ai").length;
  const claimed = launches.filter((row) => row.socap_claimed).length;

  return (
    <article className="prose">
      <h1>Method</h1>
      <p>
        This is a public reconstruction of SoCap-adjacent posts around Wispr Flow, plus a thin Poly AI
        contrast (work-page hero, not a creator wave). Rows come from{" "}
        <code>data/launches.json</code> ({launches.length} objects). The X-wave dump is also stored at{" "}
        <code>data/x-wave-arnav.json</code> (29 rows, merged by URL into the ledger). Source URLs are
        listed in <code>data/sources.md</code>. Poly gap note: <code>data/poly-reject.md</code>.
      </p>

      <h2>How rows were collected</h2>
      <ul>
        <li>
          SoCap site pages (home, about, work/wispr-flow, work/poly-ai, careers) for the company claim
          stack and the work-page heroes.
        </li>
        <li>
          Public LinkedIn, Product Hunt, press, official Wispr posts, and the PolyAI client blog —
          no invented contracts.
        </li>
        <li>
          X wave (2026-09-15): logged-in dump in <code>data/x-wave-arnav.json</code>, merged by URL.
          Hero <code>tankots/status/2025981424470479008</code>, @socapinc quote-tweet, Vedika hiring /
          process posts, company cutdown, then creator quotes with offsets.
        </li>
        <li>
          Metrics are copied from the dump or from public pages when present; missing fields stay{" "}
          <code>null</code>.
        </li>
        <li>
          <code>socap_claimed</code> is true only on public SoCap/staff/work-page evidence, the Wispr
          hero via the QT, Vijay’s LinkedIn amp, and the Poly work-page hero ({claimed} rows).
        </li>
      </ul>

      <h2>What this ledger now contains</h2>
      <p>
        {xRows} X rows out of {launches.length} total. {polyRows} rows with <code>launch_key=poly_ai</code>
        (hero + SoCap work page + client blog). Timeline offsets on a launch page use{" "}
        <code>posted_offset_hours</code> (nulls last, T-0 hero first).
      </p>

      <h2>External wiring — harness</h2>
      <p>
        <code>npm run harness</code> calls more than one counted API:{" "}
        <code>publish.x.com/oembed</code>, <code>api.fxtwitter.com</code>,{" "}
        <code>api.microlink.io</code>, plus optional X API v2 and Product Hunt GraphQL when tokens
        exist. Open Graph / PH HTML page fetches are scrape and are not counted. Dry-run works with no
        secrets. Docs: <code>harness/README.md</code>.
      </p>
      <WorkFetchNote />
      <p>
        YouTube oEmbed is also wired at runtime for any <code>youtube.com</code> / <code>youtu.be</code>{" "}
        URL in JSON. Current ledger YouTube URLs: {youtubeRows}. If none, the embed is skipped and the
        row URL still opens.
      </p>

      <h2>Limitations</h2>
      <ul>
        <li>
          Medium/low creator rows are launch-adjacent. A SoCap contract is not proven unless{" "}
          <code>socap_claimed</code> is true.
        </li>
        <li>
          <code>followers_approx</code> is often null. Do not rank the wave by follower count from this
          file.
        </li>
        <li>
          LinkedIn metrics are sparse. Some datetime values are calendar-day precision, not
          snowflake-precise.
        </li>
        <li>
          Poly AI creator-wave (quote-tweets, offsets, voice-matched adjacent posts) was not
          reconstructed. See <code>data/poly-reject.md</code>.
        </li>
      </ul>

      <h2>Non-claims</h2>
      <ul>
        <li>Not affiliated with Social Capital Inc., Wispr Flow, PolyAI, or any listed author.</li>
        <li>Does not claim every quoted creator was paid or ghostwritten.</li>
        <li>Does not claim follower rank is the ordering principle — that is the falsifier.</li>
        <li>Does not treat SoCap homepage view totals as per-post measurement.</li>
        <li>
          Does not send mail. See{" "}
          <a href={`${import.meta.env.BASE_URL}APPLY.md`}>APPLY.md</a> (Why SoCap
          left blank).
        </li>
      </ul>

      <h2>Site pages used</h2>
      <ul>
        {SOCAP_SOURCES.map((s) => (
          <li key={s.href}>
            <a href={s.href} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
