import { WorkFetchNote } from "../components/WorkFetchNote";
import { useLaunchData } from "../launchData";
import { SOCAP_SOURCES } from "../insight";

export function MethodPage() {
  const { launches } = useLaunchData();
  const xRows = launches.filter((row) => row.platform === "x").length;
  const youtubeRows = launches.filter((row) => /youtu\.?be/.test(row.url)).length;
  const polyRows = launches.filter((row) => row.launch_key === "poly_ai").length;
  const claimed = launches.filter((row) => row.socap_claimed).length;

  return (
    <article className="prose">
      <h1>Method</h1>
      <p>
        This is a public reconstruction of SoCap-adjacent posts around Wispr Flow, plus a Poly AI
        contrast packet (12 public rows: work-page embed, campaign/press, raise LinkedIn — not a
        creator wave). Rows come from <code>data/launches.json</code> ({launches.length} objects),
        also served at <code>/data/launches.json</code>. The X-wave dump is stored at{" "}
        <code>data/x-wave-arnav.json</code> (29 rows, merged by URL). Poly contrast:{" "}
        <code>data/poly-contrast.json</code> ({polyRows} rows). Rejects:{" "}
        <code>data/poly-reject.md</code>. Sources: <code>data/sources.md</code>.
      </p>

      <h2>How rows were collected</h2>
      <ul>
        <li>
          SoCap site pages (home, about, work/wispr-flow, work/poly-ai, careers) for the company claim
          stack and official work-page URLs.
        </li>
        <li>
          Public LinkedIn, Product Hunt, press, official Wispr / PolyAI posts — no invented contracts.
        </li>
        <li>
          X wave (2026-09-15): logged-in dump in <code>data/x-wave-arnav.json</code>, merged by URL.
          Hero <code>tankots/status/2025981424470479008</code>, @socapinc quote-tweet, Vedika hiring /
          process posts, company cutdown, then creator quotes with offsets.
        </li>
        <li>
          Metrics are copied from public pages when present (Wispr T-0 hero: SoCap work-page embed
          likes/replies only). Missing fields stay <code>null</code>. The logged-in X dump is still
          in <code>data/x-wave-arnav.json</code> for URLs/offsets; dump view counts are not copied
          onto the hero row.
        </li>
        <li>
          <code>socap_claimed</code> is a public-page flag in JSON ({claimed} true rows), not a creator
          contract. Filter it with <code>?socap_claimed=true|false</code>.
        </li>
      </ul>

      <h2>What this ledger now contains</h2>
      <p>
        {launches.length} rows: Wispr Flow plus {polyRows} <code>launch_key=poly_ai</code> public
        contrast rows (also listed in <code>data/poly-contrast.json</code>). {xRows} X rows. Timeline
        offsets use <code>posted_offset_hours</code> (nulls last, T-0 hero first). Wispr hero id{" "}
        <code>2025981424470479008</code>; Poly featured X id <code>2023789465509015972</code>.
      </p>

      <h2>External wiring — harness</h2>
      <p>
        <code>npm run harness</code> calls more than one counted API:{" "}
        <code>publish.x.com/oembed</code>, <code>api.fxtwitter.com</code>,{" "}
        <code>api.microlink.io</code>, plus optional X API v2 and Product Hunt GraphQL when tokens
        exist. Open Graph / PH HTML page fetches are scrape and are not counted. Dry-run works with no
        secrets. Docs: <code>harness/README.md</code>. The app also GETs{" "}
        <code>/data/launches.json</code> at runtime (bundled JSON is the fallback so the ledger does
        not go empty).
      </p>
      <p>
        Last counted dry-run on this branch: <code>counted_api_count=3</code>,{" "}
        <code>s_shaped=true</code>, APIs <code>oembed</code> + <code>fxtwitter</code> +{" "}
        <code>microlink</code>. <code>rows_scanned=81</code>. last-run key{" "}
        <code>sha256:49eab9aba90bbc9a2ff329322b2f4b0459a2ec4000659104707f57c4c1672692</code>{" "}
        (<code>harness/out/last-run.json</code>, started 2026-09-15T09:13:58.203Z). Summary:{" "}
        <code>harness/fixtures/counted-dry-run.json</code>.
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
          Poly AI is 12 public URLs, not a Wispr-style X creator-wave dump. See{" "}
          <code>data/poly-reject.md</code>.
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
