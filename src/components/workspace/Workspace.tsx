import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { getCarProfile } from "../../data/carProfiles";
import { useCatalogStore } from "../../data/catalog";
import { useSetupStore } from "../../store/setupStore";
import { useSessionStore } from "../../store/sessionStore";
import SetupList from "./SetupList";
import WorkspaceTabs from "./WorkspaceTabs";
import EngineeringSidebar from "./EngineeringSidebar";

export default function Workspace() {
  const navigate = useNavigate();
  const session = useSessionStore((state) => state.session);
  const setups = useSetupStore((state) => state.setups);
  const createSetup = useSetupStore((state) => state.createSetup);
  const openSetup = useSetupStore((state) => state.openSetup);

  const cars = useCatalogStore((state) => state.cars);
  const selectedCarId = useCatalogStore((state) => state.selectedCarId);
  const selectCar = useCatalogStore((state) => state.selectCar);

  const hasAnySetup = useMemo(() => setups.length > 0, [setups.length]);
  const selectedCar = cars.find((car) => car.id === selectedCarId);
  const profile = getCarProfile(selectedCarId);

  const handleCreateSetup = () => {
    const created = createSetup(`${selectedCar?.name ?? profile.displayName} Baseline`);
    openSetup(created.id);
  };

  return (
    <div className="workspace-shell">
      <div className="workspace-actions-bar">
        <div className="workspace-actions-left">
          <label className="workspace-car-switcher">
            <span>Change Car</span>
            <select
              value={selectedCarId}
              onChange={(e) => selectCar(e.target.value)}
            >
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.name}
                </option>
              ))}
            </select>
          </label>

          <div className="workspace-car-summary">
            <strong>{profile.displayName}</strong>
            <span>{profile.workspaceSummary}</span>
          </div>
        </div>

        <div className="workspace-actions-right">
          <button className="secondary-action workspace-new-session" onClick={() => navigate("/new-session")}>
            New Session
          </button>
        </div>
      </div>

      <div className="workspace">
        <aside className="workspace-left">
          <SetupList />
        </aside>

        <main className="workspace-center">
          {!hasAnySetup ? (
            <div className="workspace-onboarding">
              <div className="workspace-onboarding-card">
                <p className="section-label">Quick Start</p>
                <h2>Start your first setup</h2>
                <p>
                  {session
                    ? `Session ${session.name} is ready. Create a baseline setup to begin engineering work.`
                    : "Create a baseline setup to begin engineering work."}
                </p>
                <div className="new-session-actions">
                  <button className="primary-action" onClick={handleCreateSetup}>
                    Create Baseline Setup
                  </button>
                  <button className="secondary-action" onClick={() => navigate("/new-session")}>
                    New Session
                  </button>
                  <button className="secondary-action" onClick={() => navigate("/database")}>
                    Open Database
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <WorkspaceTabs />
          )}
        </main>

        <aside className="workspace-right">
          <EngineeringSidebar />
        </aside>
      </div>
    </div>
  );
}
