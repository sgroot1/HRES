import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useRunStore } from "../../store/runStore";
import { useSessionStore } from "../../store/sessionStore";
import { useSetupStore } from "../../store/setupStore";

type CarKey = "sdm26" | "mustang";

type NavItem = {
  label: string;
  path: string;
};

type CarProfile = {
  optionLabel: string;
  subtitle: string;
  tabs: NavItem[];
};

const STORAGE_KEY = "hres.selectedCarProfile";

const CAR_PROFILES: Record<CarKey, CarProfile> = {
  sdm26: {
    optionLabel: "SDM26 · Autocross",
    subtitle: "AUTOCROSS / TEST DAY",
    tabs: [
      { label: "Control", path: "/" },
      { label: "Setup", path: "/workspace" },
      { label: "Runs", path: "/runs" },
      { label: "Performance", path: "/dashboard" },
      { label: "Database", path: "/database" },
      { label: "Compare", path: "/compare" },
    ],
  },
  mustang: {
    optionLabel: "Mustang · Endurance",
    subtitle: "ENDURANCE / RACE WEEKEND",
    tabs: [
      { label: "Control", path: "/" },
      { label: "Setup", path: "/sportscarsetup" },
      { label: "Runs", path: "/runs" },
      { label: "Dashboard", path: "/dashboard" },
      { label: "Endurance", path: "/endurance" },
      { label: "Database", path: "/database" },
    ],
  },
};

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const session = useSessionStore((state) => state.session);
  const setup = useSetupStore((state) => state.currentSetup);
  const run = useRunStore((state) => state.currentRun);

  const [carKey, setCarKey] = useState<CarKey>("sdm26");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved === "mustang" || saved === "sdm26") {
      setCarKey(saved);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, carKey);
  }, [carKey]);

  const profile = useMemo(() => CAR_PROFILES[carKey], [carKey]);

  const activeLabel =
    setup?.name ??
    session?.name ??
    profile.subtitle;

  return (
    <header className="appheader-shell">
      <div className="appheader-brand">
        <div className="appheader-logo">H</div>

        <div className="appheader-brand-text">
          <div className="appheader-title">HELIOS</div>
          <div className="appheader-subtitle">SETUP MANAGER</div>
        </div>

        <select
          className="appheader-car-select"
          value={carKey}
          onChange={(e) => setCarKey(e.target.value as CarKey)}
          aria-label="Select car"
        >
          {Object.entries(CAR_PROFILES).map(([key, value]) => (
            <option key={key} value={key}>
              {value.optionLabel}
            </option>
          ))}
        </select>

        <div className="appheader-brand-detail">
          {activeLabel}
        </div>
      </div>

      <nav className="appheader-nav">
        {profile.tabs.map((item) => {
          const active = location.pathname === item.path;

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={active ? "appheader-pill active" : "appheader-pill"}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="appheader-status">
        <span className="appheader-chip">
          <span className="status-dot" />
          LIVE
        </span>

        <span className="appheader-chip muted">
          {session?.vehicle ?? "NO SESSION"} • {run?.driver ?? session?.driver ?? "--"}
        </span>
      </div>
    </header>
  );
}
