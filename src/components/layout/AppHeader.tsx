import { useLocation, useNavigate } from "react-router-dom";

import { getCarProfile } from "../../data/carProfiles";
import { useCatalogStore } from "../../data/catalog";
import { useRunStore } from "../../store/runStore";
import { useSessionStore } from "../../store/sessionStore";
import { useSetupStore } from "../../store/setupStore";

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const session = useSessionStore((state) => state.session);
  const setup = useSetupStore((state) => state.currentSetup);
  const run = useRunStore((state) => state.currentRun);

  const cars = useCatalogStore((state) => state.cars);
  const selectedCarId = useCatalogStore((state) => state.selectedCarId);

  const profile = getCarProfile(selectedCarId);
  const selectedCar = cars.find((car) => car.id === selectedCarId);
  const activeLabel = setup?.name ?? session?.name ?? selectedCar?.name ?? profile.displayName;

  return (
    <header className="appheader-shell">
      <button type="button" className="appheader-brand" onClick={() => navigate("/")} aria-label="Go to control room">
        <span className="appheader-mark">
          <span className="appheader-mark-inner">H</span>
        </span>
        <span className="appheader-brand-copy">
          <span className="appheader-wordmark">HELIOS</span>
          <span className="appheader-brand-subtitle">{profile.descriptor}</span>
        </span>
      </button>

      <nav className="appheader-nav" aria-label="Primary navigation">
        {profile.headerTabs.map((item) => {
          const active =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={active ? "appheader-pill active" : "appheader-pill"}
              aria-current={active ? "page" : undefined}
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

        <span className="appheader-chip muted">{profile.subtitle}</span>
        <span className="appheader-chip muted">{activeLabel}</span>
        <span className="appheader-chip muted">{session?.driver ?? run?.driver ?? "--"}</span>
      </div>
    </header>
  );
}
