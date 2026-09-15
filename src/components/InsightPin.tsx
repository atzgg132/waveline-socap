import { INSIGHT } from "../content/insight";

export function InsightPin() {
  return (
    <aside className="pin" aria-label="Pinned insight">
      <div className="pin-kicker">
        <strong>{INSIGHT.status}</strong>
        {INSIGHT.kicker}
      </div>
      <div className="pin-body">
        <p className="pin-claim">{INSIGHT.claim}</p>
        <p className="pin-evidence">
          {INSIGHT.evidence.map((item, i) => (
            <span key={item.href}>
              {i > 0 ? " · " : "Evidence: "}
              <a href={item.href} target="_blank" rel="noreferrer">
                {item.label}
              </a>
            </span>
          ))}
        </p>
        <div className="pin-meta">
          <span>{INSIGHT.falsify}</span>
        </div>
      </div>
    </aside>
  );
}
