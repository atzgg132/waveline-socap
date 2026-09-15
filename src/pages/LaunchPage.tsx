import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { InsightPin } from "../components/InsightPin";
import { Filters } from "../components/Filters";
import { ConfidenceBadge } from "../components/ConfidenceBadge";
import { SocapBadge } from "../components/SocapBadge";
import { YoutubeOEmbed } from "../components/YoutubeOEmbed";
import { LedgerTable } from "../components/LedgerTable";
import {
  applyFilters,
  EMPTY_FILTERS,
  formatMetric,
  formatOffset,
  handleDisplay,
  isT0Hero,
  launchKeyFromSlug,
  repliesOf,
  sortTimeline,
} from "../ledger";
import { launches } from "../loadLaunches";

export function LaunchPage() {
  const { slug = "" } = useParams();
  const launchKey = launchKeyFromSlug(slug);
  const scoped = useMemo(
    () => launches.filter((row) => row.launch_key === launchKey || row.launch_key === slug),
    [launchKey, slug],
  );
  const defaultWave = launchKey === "wispr_flow" ? "android-x-2026" : "";
  const [filters, setFilters] = useState({
    ...EMPTY_FILTERS,
    wave: defaultWave,
  });

  useEffect(() => {
    setFilters({ ...EMPTY_FILTERS, wave: defaultWave });
  }, [launchKey, defaultWave]);

  const timeline = useMemo(
    () => sortTimeline(applyFilters(scoped, filters)),
    [scoped, filters],
  );
  const hero = timeline.find(isT0Hero) ?? null;
  const rest = hero ? timeline.filter((row) => row.id !== hero.id) : timeline;

  if (scoped.length === 0) {
    return (
      <>
        <InsightPin />
        <div className="note">
          No rows for launch_key <code>{launchKey}</code>. Nothing invented.
        </div>
      </>
    );
  }

  return (
    <>
      <InsightPin />
      <Filters
        rows={scoped}
        filters={filters}
        onChange={setFilters}
        includeWave
        defaultWave={defaultWave}
      />
      <p className="count">
        {timeline.length} rows · launch_key={scoped[0]?.launch_key} · timeline by posted_offset_hours
        (nulls last) · T-0 hero first
      </p>
      {hero ? (
        <section className="hero">
          <div className="kicker">T-0 hero</div>
          <h2>{hero.hook_text}</h2>
          <div className="hero-meta">
            <span>{handleDisplay(hero.author_handle)}</span>
            <span>{hero.author_name}</span>
            <span>{hero.platform}</span>
            <span>{hero.datetime_utc}</span>
            <span>{formatOffset(hero.posted_offset_hours)}</span>
            <span>views {formatMetric(hero.metrics.views)}</span>
            <span>likes {formatMetric(hero.metrics.likes)}</span>
            <span>replies {formatMetric(repliesOf(hero))}</span>
            <ConfidenceBadge value={hero.confidence} />
            <SocapBadge claimed={hero.socap_claimed} />
          </div>
          <p>
            <a href={hero.url} target="_blank" rel="noreferrer">
              {hero.url}
            </a>
          </p>
          <p style={{ color: "#8a8a8a" }}>{hero.source_note}</p>
          {hero.media_preview_url ? (
            <img className="thumb" src={hero.media_preview_url} alt="" />
          ) : null}
          <YoutubeOEmbed url={hero.url} />
        </section>
      ) : (
        <div className="note">No T-0 hero row in the current filter set.</div>
      )}
      <ol className="timeline">
        {rest.map((row) => (
          <li key={row.id}>
            <div className="offset">{formatOffset(row.posted_offset_hours)}</div>
            <div>
              <a href={row.url} target="_blank" rel="noreferrer">
                {row.hook_text}
              </a>{" "}
              <SocapBadge claimed={row.socap_claimed} />
            </div>
            <div style={{ color: "#8a8a8a" }}>
              {handleDisplay(row.author_handle)} · {row.platform} · {row.asset_type} ·{" "}
              {row.author_type}
              {row.is_video ? " · video" : ""} · <ConfidenceBadge value={row.confidence} />
            </div>
          </li>
        ))}
      </ol>
      {timeline.length === 0 ? (
        <div className="note">No rows match these filters.</div>
      ) : (
        <LedgerTable rows={timeline} />
      )}
    </>
  );
}
