import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCatalogStore } from "../data/catalog";
import { useRunStore } from "../store/runStore";
import { useSessionStore } from "../store/sessionStore";
import { useSetupStore } from "../store/setupStore";

export default function NewSession() {
  const navigate = useNavigate();

  const createSession = useSessionStore((state) => state.createSession);
  const createSetup = useSetupStore((state) => state.createSetup);
  const openSetup = useSetupStore((state) => state.openSetup);
  const createRun = useRunStore((state) => state.createRun);

  const tracks = useCatalogStore((state) => state.tracks);
  const drivers = useCatalogStore((state) => state.drivers);
  const cars = useCatalogStore((state) => state.cars);
  const addTrack = useCatalogStore((state) => state.addTrack);
  const addDriver = useCatalogStore((state) => state.addDriver);
  const addCar = useCatalogStore((state) => state.addCar);
  const selectCarByName = useCatalogStore((state) => state.selectCarByName);

  const [name, setName] = useState("");
  const [vehicle, setVehicle] = useState(cars[0]?.name ?? "SDM26");
  const [track, setTrack] = useState("");
  const [driver, setDriver] = useState("");
  const [engineer, setEngineer] = useState("");
  const [customTrack, setCustomTrack] = useState("");
  const [customDriver, setCustomDriver] = useState("");
  const [customCar, setCustomCar] = useState("");

  const ready = useMemo(() => name.trim() && track && driver.trim(), [name, track, driver]);

  return (
    <div className="app">
      <div className="new-session-shell">
        <section className="new-session-card">
          <div className="new-session-header">
            <div>
              <p className="section-label">Session Setup</p>
              <h1>New Test Session</h1>
            </div>
            <div className="new-session-pill">Helios Ready</div>
          </div>

          <div className="new-session-grid">
            <label className="field">
              <span>Session Name</span>
              <input
                placeholder="e.g. AMP Tire Test"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label className="field">
              <span>Vehicle</span>
              <select value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
                {cars.map((option) => (
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Track</span>
              <select value={track} onChange={(e) => setTrack(e.target.value)}>
                <option value="">Select Track</option>
                {tracks.map((option) => (
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Driver</span>
              <select value={driver} onChange={(e) => setDriver(e.target.value)}>
                <option value="">Select Driver</option>
                {drivers.map((option) => (
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Engineer</span>
              <input
                placeholder="Engineer"
                value={engineer}
                onChange={(e) => setEngineer(e.target.value)}
              />
            </label>
          </div>

          <div className="new-session-database">
            <div className="new-session-database-card">
              <h3>Add to database</h3>
              <div className="new-session-grid compact">
                <label className="field">
                  <span>New Track</span>
                  <input
                    value={customTrack}
                    onChange={(e) => setCustomTrack(e.target.value)}
                    placeholder="e.g. Monza"
                  />
                </label>
                <label className="field">
                  <span>New Driver</span>
                  <input
                    value={customDriver}
                    onChange={(e) => setCustomDriver(e.target.value)}
                    placeholder="e.g. Riley Brooks"
                  />
                </label>
                <label className="field">
                  <span>New Car</span>
                  <input
                    value={customCar}
                    onChange={(e) => setCustomCar(e.target.value)}
                    placeholder="e.g. SDM28"
                  />
                </label>
              </div>
              <div className="new-session-actions">
                <button
                  className="secondary-action"
                  onClick={() => {
                    if (customTrack.trim()) {
                      addTrack(customTrack.trim());
                      setCustomTrack("");
                    }
                    if (customDriver.trim()) {
                      addDriver(customDriver.trim());
                      setCustomDriver("");
                    }
                    if (customCar.trim()) {
                      const entry = addCar(customCar.trim());
                      setVehicle(entry.name);
                      setCustomCar("");
                    }
                  }}
                >
                  Save to Database
                </button>
              </div>
            </div>
          </div>

          <div className="new-session-actions">
            <button
              className="primary-action"
              onClick={() => {
                if (!ready) return;
                selectCarByName(vehicle);
                createSession({ name, vehicle, track, driver, engineer });
                const baseline = createSetup(`${vehicle} Baseline`);
                openSetup(baseline.id);
                createRun(baseline.id, driver, track);

                navigate("/workspace");
              }}
            >
              Create Session
            </button>
            <button className="secondary-action" onClick={() => navigate("/")}>Back</button>
          </div>
        </section>
      </div>
    </div>
  );
}
