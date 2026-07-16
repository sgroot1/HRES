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

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = useSessionStore((state) => state.session);
  const setup = useSetupStore((state) => state.currentSetup);
  const run = useRunStore((state) => state.currentRun);
  
export default function AppHeader() {
    return (
    <div className="appheader-shell" style={{ paddingTop: 28, paddingBottom: 24, marginBottom: 24 }}>
      <div className="appheader-brand" style={{ paddingTop: 4 }}>
        <div className="appheader-logo">H</div>
        <div className="appheader-brand-text">
          <div className="appheader-title">HRES</div>
          <div className="appheader-subtitle">
            {setup?.name ?? session?.name ?? "Helios Race Engineering Suite"}
          </div>
        </div>
      </div>

      <div className="appheader-status">
        <span className="appheader-chip">
          <span className="status-dot" />
          Live
        </span>
        <span className="appheader-chip muted">
          {session?.vehicle ?? "--"} • {run?.driver ?? session?.driver ?? "--"}
        </span>
      </div>

      <div className="appheader-nav">
        {items.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={active ? "appheader-pill active" : "appheader-pill"}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
