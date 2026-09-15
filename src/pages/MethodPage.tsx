export function MethodPage() {
  return (
    <article className="prose">
      <p className="page-kicker">Public method</p>
      <h1 className="page-title">How this ledger is built</h1>
      <p className="page-lead">
        Reconstruction from pages anyone can open. Not affiliated with Social
        Capital Inc. Corpus is 42 CoS rows (all <code>launch_key=wispr_flow</code>
        ). Additive <code>wave</code>: <code>wispr-ph-2024-09</code>,{" "}
        <code>wispr-android-2026-02</code>, <code>wispr-wom</code>.
      </p>

      <p className="banner">
        <strong>X.com scrape returned 403</strong> — waiting on Arnav for post
        URLs. A denser X wave is blocked until those URLs land. Do not invent
        x.com rows to fill the gap.
      </p>

      <h2>Slice</h2>
      <p>
        Influencers primary (31 / 42 in this pack). Depth launch is Wispr Flow.
        CoS schema omits <code>wave</code>; the app keeps it as an additive
        field for the Wave filter: <code>wispr-ph-2024-09</code>,{" "}
        <code>wispr-android-2026-02</code>, <code>wispr-wom</code>.
      </p>

      <h2>What counts as a row</h2>
      <p>
        A row exists only if a public URL can be cited. Hook text is a short
        paraphrase of visible copy — not a fabricated quote. Schema lives in{" "}
        <code>docs/SCHEMA.md</code> (same contract as <code>data/SCHEMA.md</code>
        ). Required CoS fields: <code>launch_key</code>, <code>client</code>,{" "}
        <code>date</code>, <code>datetime_utc</code>, <code>asset_type</code>,{" "}
        <code>platform</code>, <code>author_*</code>, <code>hook_*</code>,{" "}
        <code>metrics</code>, <code>url</code>, <code>source_note</code>,{" "}
        <code>confidence</code>.
      </p>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>App filter</th>
            <th>Rule</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>client</code> / <code>launch_key</code>
            </td>
            <td>product</td>
            <td>Product dropdown matches either.</td>
          </tr>
          <tr>
            <td>
              <code>wave</code> (additive)
            </td>
            <td>wave</td>
            <td>
              Exact additive <code>wave</code> string:{" "}
              <code>wispr-ph-2024-09</code>, <code>wispr-android-2026-02</code>,{" "}
              <code>wispr-wom</code>.
            </td>
          </tr>
          <tr>
            <td>
              <code>author_type</code>
            </td>
            <td>role</td>
            <td>As stored (influencer, official, …).</td>
          </tr>
          <tr>
            <td>
              <code>platform</code>
            </td>
            <td>platform</td>
            <td>x, linkedin, web, producthunt, … as stored.</td>
          </tr>
          <tr>
            <td>
              <code>confidence</code>
            </td>
            <td>confidence</td>
            <td>high / medium as stored. low → data/rejected.md.</td>
          </tr>
          <tr>
            <td>
              <code>datetime_utc</code> / <code>date</code>
            </td>
            <td>from / to</td>
            <td>Inclusive UTC day bounds.</td>
          </tr>
        </tbody>
      </table>

      <h2>Confidence</h2>
      <ul>
        <li>
          <strong>high</strong> — public URL with enough chrome to identify
          author, time, and platform.
        </li>
        <li>
          <strong>medium</strong> — public but incomplete (e.g. missing a metric
          or a precise offset).
        </li>
        <li>
          <strong>low</strong> — not stored here. See <code>data/rejected.md</code>
          .
        </li>
      </ul>
      <p>
        Metrics are integers only when visible on that page. Missing values stay{" "}
        <code>null</code> / —. Company-level view claims are not copied onto a
        post that does not show them.
      </p>

      <h2>Refresh</h2>
      <p>
        Edit <code>data/launches.json</code>, run <code>npm run sync-data</code>,
        commit both Corpus and <code>public/data/launches.json</code>. Details in
        README.
      </p>

      <h2>Non-claims</h2>
      <ul>
        <li>No private creator rates or leaked docs.</li>
        <li>No invented posts, ties, or quotes.</li>
        <li>No chatbot. No motion mascot. The product is the ledger.</li>
      </ul>
    </article>
  );
}
