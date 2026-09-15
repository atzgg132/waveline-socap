import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <>
      <p className="page-kicker">404</p>
      <h1 className="page-title">No such route</h1>
      <p className="page-lead">
        Ledger is <Link to="/">home</Link>, depth is{" "}
        <Link to="/launch/wispr-flow">/launch/wispr-flow</Link>, method is{" "}
        <Link to="/method">/method</Link>.
      </p>
    </>
  );
}
