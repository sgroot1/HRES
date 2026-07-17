import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCatalogStore } from "../data/catalog";
import { useSetupStore } from "../store/setupStore";
import type { Setup } from "../types/setup";

export default function SetupDatabase() {
  const navigate = useNavigate();

  const cars = useCatalogStore((state) => state.cars);
  const selectedCarId = useCatalogStore((state) => state.selectedCarId);
  const selectCar = useCatalogStore((state) => state.selectCar);
  const addCar = useCatalogStore((state) => state.addCar);

  const setups = useSetupStore((state) => state.setups);
  const currentSetup = useSetupStore((state) => state.currentSetup);
  const createSetup = useSetupStore((state) => state.createSetup);
  const openSetup = useSetupStore((state) => state.openSetup);
  const duplicateSetup = useSetupStore((state) => state.duplicateSetup);
  const deleteSetup = useSetupStore((state) => state.deleteSetup);
  const loadExampleSetups = useSetupStore((state) => state.loadExampleSetups);

  const [search, setSearch] = useState("");
  const [newCarName, setNewCarName] = useState("");

  useEffect(() => {
    if (!setups.length) {
      loadExampleSetups();
    }
  }, [loadExampleSetups, setups.length]);

  const selectedCar = cars.find((car) => car.id === selectedCarId);

  const filteredSetups = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return setups;

    return setups.filter((setup) => {
      return (
        setup.name.toLowerCase().includes(q) ||
        setup.general.driver.toLowerCase().includes(q) ||
        setup.general.track.toLowerCase().includes(q) ||
        setup.general.event.toLowerCase().includes(q) ||
        setup.status.toLowerCase().includes(q)
      );
    });
  }, [search, setups]);

  const handleCreateSetup = () => {
    const newSetup = createSetup(`${selectedCar?.name ?? "Car"} Setup`);
    openSetup(newSetup.id);
    navigate("/workspace");
  };

  const handleOpenSetup = (setup: Setup) => {
    openSetup(setup.id);
    navigate("/workspace");
  };

  return (
    <div className="database-shell">
      <div className="database-panel">
        <div className="database-header">
          <div>
            <div className="compare-kicker">Car Database</div>
            <h1>{selectedCar?.name ?? "Cars"}</h1>
          </div>

          <div className="runs-actions">
            <button className="primary-action" onClick={handleCreateSetup}>
              + New Setup
            </button>
            <button className="secondary-action" onClick={() => navigate("/compare")}>
              Compare Setups
            </button>
          </div>
        </div>

        <div className="database-card">
          <div className="database-card-title">Cars</div>

          <div className="saved-setups-strip">
            {cars.map((car) => {
              const active = selectedCarId === car.id;
              return (
                <div key={car.id} className={active ? "setup-card-row active" : "setup-card-row"}>
                  <div className="setup-card-head">
                    <span className="setup-card-version">CAR</span>
                    <span className="setup-card-date">{car.id}</span>
                  </div>

                  <div className="setup-card-body">
                    <h3>{car.name}</h3>
                    <p>{active ? "Selected car" : "Car available in database"}</p>
                  </div>

                  <div className="setup-card-actions">
                    <button className="setup-card-edit" onClick={() => selectCar(car.id)}>
                      Switch
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="database-inline-form" style={{ marginTop: 16 }}>
            <input
              value={newCarName}
              onChange={(e) => setNewCarName(e.target.value)}
              placeholder="Add a new car to the database"
            />
            <button
              className="secondary-action"
              onClick={() => {
                if (!newCarName.trim()) return;
                const created = addCar(newCarName.trim());
                selectCar(created.id);
                setNewCarName("");
              }}
            >
              Add Car
            </button>
          </div>
        </div>

        <div className="database-card">
          <div className="database-card-title">Search</div>

          <div className="database-inline-form">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by setup, driver, track, event, or status"
            />
          </div>
        </div>

        <div className="database-card">
          <div className="database-card-title">
            Setup Library for {selectedCar?.name ?? "Selected Car"} ({filteredSetups.length})
          </div>

          {filteredSetups.length === 0 ? (
            <p className="session-message">
              No setups found for this car. Create a baseline setup to begin.
            </p>
          ) : (
            <div className="saved-setups-strip">
              {filteredSetups.map((setup) => {
                const isActive = currentSetup?.id === setup.id;
                const updatedDate = new Date(setup.updatedAt).toLocaleDateString();

                return (
                  <div key={setup.id} className={isActive ? "setup-card-row active" : "setup-card-row"}>
                    <div className="setup-card-head">
                      <span className="setup-card-version">V{setup.version}</span>
                      <span className="setup-card-date">{updatedDate}</span>
                    </div>

                    <div className="setup-card-body">
                      <h3>{setup.name}</h3>
                      <p>{setup.general.driver || "Driver not set"}</p>
                      <p>{setup.general.track || "Track not set"}</p>
                      <p>{setup.status}</p>
                    </div>

                    <div className="setup-card-actions">
                      <button className="setup-card-edit" onClick={() => handleOpenSetup(setup)}>
                        Open
                      </button>

                      <button className="setup-card-link" onClick={() => duplicateSetup(setup.id)}>
                        Duplicate
                      </button>

                      <button className="setup-card-link" onClick={() => deleteSetup(setup.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
