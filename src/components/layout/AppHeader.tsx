import { NavLink } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useSessionStore } from "../../store/sessionStore";
import { useSetupStore } from "../../store/setupStore";
import { useRunStore } from "../../store/runStore";

const items = [
  { label: "Mission", path: "/" },
  { label: "Workspace", path: "/workspace" },
  { label: "Runs", path: "/runs" },
  { label: "Performance", path: "/performance" },
  { label: "Database", path: "/database" },
  { label: "Compare", path: "/compare" },
];

export default function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = useSessionStore((state) => state.session);
  const setup = useSetupStore((state) => state.currentSetup);
  const run = useRunStore((state) => state.currentRun);
  
export default function AppHeader() {
    return (
    <div className="topnav-shell" style={{ paddingTop: 28, paddingBottom: 24, marginBottom: 24 }}>
      <div className="topnav-brand" style={{ paddingTop: 4 }}>
        <div className="topnav-logo">H</div>
        <div className="topnav-brand-text">
          <div className="topnav-title">HRES</div>
          <div className="topnav-subtitle">
            {setup?.name ?? session?.name ?? "Helios Race Engineering Suite"}
          </div>
        </div>
      </div>

      <div className="topnav-status">
        <span className="topnav-chip">
          <span className="status-dot" />
          Live
        </span>
        <span className="topnav-chip muted">
          {session?.vehicle ?? "--"} • {run?.driver ?? session?.driver ?? "--"}
        </span>
      </div>

      <div className="topnav-nav">
        {items.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={active ? "topnav-pill active" : "topnav-pill"}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
