import { NavLink } from "react-router-dom";

export default function AppHeader() {
  return (
    <header className="topnav-shell">
      <div className="topnav-brand">
        <div className="topnav-logo">H</div>

        <div className="topnav-brand-text">
          <div className="topnav-title">HRES</div>
          <div className="topnav-subtitle">Helios Race Engineering Suite</div>
        </div>
      </div>

      <nav className="topnav-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "topnav-pill active" : "topnav-pill"
          }
        >
          Mission Control
        </NavLink>

        <NavLink
          to="/workspace"
          className={({ isActive }) =>
            isActive ? "topnav-pill active" : "topnav-pill"
          }
        >
          Workspace
        </NavLink>

        <NavLink
          to="/runs"
          className={({ isActive }) =>
            isActive ? "topnav-pill active" : "topnav-pill"
          }
        >
          Run Review
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "topnav-pill active" : "topnav-pill"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/database"
          className={({ isActive }) =>
            isActive ? "topnav-pill active" : "topnav-pill"
          }
        >
          Database
        </NavLink>

        <NavLink
          to="/compare"
          className={({ isActive }) =>
            isActive ? "topnav-pill active" : "topnav-pill"
          }
        >
          Compare
        </NavLink>
      </nav>

      <div className="topnav-status">
        <span className="topnav-chip">
          <span className="status-dot" />
          Engineering
        </span>
        <span className="topnav-chip muted">Test Day Ready</span>
      </div>
    </header>
  );
}
