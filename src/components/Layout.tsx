import { NavLink, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          Waveline <span>— public SoCap creator-wave ledger</span>
        </NavLink>
        <nav>
          <NavLink to="/" end>
            Ledger
          </NavLink>
          <NavLink to="/launch/wispr-flow">Wispr Flow</NavLink>
          <NavLink to="/method">Method</NavLink>
          <a href={`${import.meta.env.BASE_URL}APPLY.md`}>APPLY.md</a>
        </nav>
      </header>
      <main className="page">
        <Outlet />
      </main>
      <footer className="site-footer">
        Public reconstruction. Not affiliated. Compiled for a SoCap application.{" "}
        <a href={`${import.meta.env.BASE_URL}APPLY.md`}>APPLY.md</a>
      </footer>
    </div>
  );
}
