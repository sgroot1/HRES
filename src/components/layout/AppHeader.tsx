import { useLocation, useNavigate } from "react-router-dom";

import { useRunStore } from "../../store/runStore";
import { useSessionStore } from "../../store/sessionStore";
import { useSetupStore } from "../../store/setupStore";

const navigation = [
  { label: "Mission Control", path: "/" },
  { label: "Workspace", path: "/workspace" },
  { label: "Run Review", path: "/runs" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Database", path: "/database" },
  { label: "Compare", path: "/compare" },
];

export default function AppHeader() {

  const navigate = useNavigate();
  const location = useLocation();

  const session = useSessionStore(
    (state) => state.session
  );

  const setup = useSetupStore(
    (state) => state.currentSetup
  );

  const run = useRunStore(
    (state) => state.currentRun
  );

  return (

    <header className="topnav-shell">

      <div className="topnav-brand">

        <div className="topnav-logo">

          H

        </div>

        <div className="topnav-brand-text">

          <div className="topnav-title">

            HRES

          </div>

          <div className="topnav-subtitle">

            {setup?.name ??
              session?.name ??
              "Helios Race Engineering Suite"}

          </div>

        </div>

      </div>

      <nav className="topnav-nav">

        {navigation.map((item) => (

          <button
            key={item.path}
            type="button"
            onClick={() => navigate(item.path)}
            className={
              location.pathname === item.path
                ? "topnav-pill active"
                : "topnav-pill"
            }
          >

            {item.label}

          </button>

        ))}

      </nav>

      <div className="topnav-status">

        <span className="topnav-chip">

          <span className="status-dot" />

          Engineering

        </span>

        <span className="topnav-chip muted">

          {session?.vehicle ?? "--"}

          {" • "}

          {run?.driver ??
            session?.driver ??
            "--"}

        </span>

      </div>

    </header>

  );

}
