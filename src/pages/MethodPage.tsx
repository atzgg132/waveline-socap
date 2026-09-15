import { WorkFetchNote } from "../components/WorkFetchNote";
import { launches } from "../loadLaunches";
import { SOCAP_SOURCES } from "../insight";

export function MethodPage() {
  const xRows = launches.filter((row) => row.platform === "x").length;
  const youtubeRows = launches.filter((row) => /youtu\.?be/.test(row.url)).length;

  return (
    <article className="prose">
      <h1>Method</h1>
      <p>
        This is a public reconstruction of SoCap-adjacent posts around Wispr Flow. Rows come from{" "}
        <code>data/launches.json</code> ({launches.length} objects). The X-wave dump is also stored at{" "}
        <code>data/x-wave-arnav.json</code> (29 rows, merged by URL into the ledger). Source URLs are
        listed in <code>data/sources.md</code>.
      </p>

      <h2>How rows were collected</h2>
      <ul>
        <li>
          SoCap site pages (home, about, work/wispr-flow, careers) for the company claim stack and the
          Wispr Flow work-page hero.
        </li>
        <li>
          Public LinkedIn, Product Hunt, press, and official Wispr posts with stable URLs — no invented
          contracts.
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
      </ul>

      <h2>What this ledger now contains</h2>
      <p>
        The X wave is in the repo: {xRows} X rows out of {launches.length} total. Timeline offsets on
        the Wispr Flow page use <code>posted_offset_hours</code> from that dump (nulls last, T-0 hero
        first). Source links on each row are the public URLs in JSON.
      </p>

      <h2>External wiring</h2>
      <WorkFetchNote />
      <p>
        YouTube oEmbed is wired at runtime for any <code>youtube.com</code> / <code>youtu.be</code> URL
        in JSON. Current ledger YouTube URLs: {youtubeRows}. If none, the embed is skipped and the row
        URL still opens.
      </p>

      <h2>Limitations</h2>
      <ul>
        <li>
          Medium/low creator rows are launch-adjacent. A SoCap contract is not proven unless the row is
          tagged as staff/official or the source_note says so.
        </li>
        <li>
          <code>followers_approx</code> is often null. Do not rank the wave by follower count from this
          file.
        </li>
        <li>
          LinkedIn metrics are sparse. Some datetime values are calendar-day precision, not
          snowflake-precise.
        </li>
        <li>Poly AI appears as a claim inside a hiring post, not as a separate hero URL in this pass.</li>
      </ul>

      <h2>Non-claims</h2>
      <ul>
        <li>Not affiliated with Social Capital Inc., Wispr Flow, or any listed author.</li>
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
