import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { useLaunches } from "../lib/DataProvider";

export function Shell({ children }: { children: ReactNode }) {
  const { rows, status } = useLaunches();
  const n = status === "ready" ? rows.length : "…";

  return (
    <div className="shell">
      <a className="skip" href="#main">
        Skip to ledger
      </a>
      <header className="mast">
        <div className="mast-inner">
          <div className="brand">
            <div className="brand-name">
              <NavLink to="/">Waveline</NavLink>
            </div>
            <div className="brand-sub">
              Public SoCap creator-wave ledger · not affiliated · {n} rows
            </div>
          </div>
          <nav className="nav" aria-label="Primary">
            <NavLink to="/" end>
              Ledger
            </NavLink>
            <NavLink to="/launch/wispr-flow">Wispr Flow</NavLink>
            <NavLink to="/method">Method</NavLink>
            <a href={`${import.meta.env.BASE_URL}APPLY.md`}>APPLY.md</a>
          </nav>
        </div>
      </header>
      <main id="main" className="main">
        {children}
      </main>
      <footer className="foot">
        <span>Public sources only · null metrics = —</span>
        <span>
          Corpus `data/` · runtime `/data/launches.json` ·{" "}
          <a href={`${import.meta.env.BASE_URL}APPLY.md`}>APPLY.md</a>
        </span>
      </footer>
    </div>
  );
}
