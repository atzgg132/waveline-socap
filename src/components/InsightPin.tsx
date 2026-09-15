import { EVIDENCE_LINKS, INSIGHT_MD, INSIGHT_TITLE, SOCAP_SOURCES } from "../insight";
import { Markdown } from "./Markdown";

export function InsightPin() {
  return (
    <aside className="insight">
      <h1>{INSIGHT_TITLE}</h1>
      <Markdown source={INSIGHT_MD.replace(/^# Insight\s*/, "")} />
      <div className="links">
        {SOCAP_SOURCES.map((s) => (
          <a key={s.href} href={s.href} target="_blank" rel="noreferrer">
            {s.label}
          </a>
        ))}
        {EVIDENCE_LINKS.map((s) => (
          <a key={s.href} href={s.href} target="_blank" rel="noreferrer">
            {s.label}
          </a>
        ))}
      </div>
    </aside>
  );
}
