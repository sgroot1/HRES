import { ChangeEvent, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "../components/database/SearchBar";
import SetupRow from "../components/database/SetupRow";

import { useSetupStore } from "../store/setupStore";
import { createCatalogStore } from "../data/catalog";
import { parseMotecCsv } from "../services/motecCsv";

const catalog = createCatalogStore();

export default function SetupDatabase() {
  const navigate = useNavigate();
  const {
    setups,
    createSetup,
    duplicateSetup,
    deleteSetup,
    openSetup,
    loadExampleSetups,
  } = useSetupStore();

  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [trackName, setTrackName] = useState("");
  const [driverName, setDriverName] = useState("");
  const [carName, setCarName] = useState("");
  const [catalogVersion, setCatalogVersion] = useState(0);
  const [tireSetId, setTireSetId] = useState("");
  const [tireCompound, setTireCompound] = useState("Hoosier R25B");
  const [tireCondition, setTireCondition] = useState("dry");
  const [tireNotes, setTireNotes] = useState("");
  const [selectedSetupId, setSelectedSetupId] = useState("");
  const [motecLinkMessage, setMotecLinkMessage] = useState<string | null>(null);
  const motecFileInputRef = useRef<HTMLInputElement | null>(null);

  const catalogState = catalog.getState();
  const filtered = useMemo(() => {
    return setups.filter((setup) => setup.name.toLowerCase().includes(search.toLowerCase()));
  }, [setups, search]);

  const refreshCatalog = () => setCatalogVersion((value) => value + 1);

  async function handleLinkMotecCsv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const targetSetupId = selectedSetupId || setups[0]?.id;
    const targetSetup = setups.find((setup) => setup.id === targetSetupId);

    if (!targetSetup) {
      setMotecLinkMessage("Create a setup before linking MoTeC CSV files.");
      event.target.value = "";
      return;
    }

    const content = await file.text();
    const parsed = parseMotecCsv(content);

    catalog.addSetupMotecCsv({
      setupId: targetSetup.id,
      setupName: targetSetup.name,
      fileName: file.name,
      lapCount: parsed.lapCount,
      sampleCount: parsed.analysis.sampleCount,
      bestLap: parsed.bestLap,
      averageLap: parsed.averageLap,
    });

    setMotecLinkMessage(`Linked ${file.name} to ${targetSetup.name}.`);
    refreshCatalog();
    event.target.value = "";
  }

  return (
    <div className="app">
      <TopNav />

      <div className="database-shell">
        <section className="database-panel">
          <div className="database-header">
            <div>
              <p className="section-label">Catalog</p>
              <h1>Setup Database</h1>
            </div>
            <div className="new-session-pill">Live</div>
          </div>

          <div className="card database-card">
            <div className="database-card-title">Create Setup</div>
            <div className="database-inline-form">
              <input placeholder="New Setup Name" value={name} onChange={(e) => setName(e.target.value)} />
              <button
                onClick={() => {
                  if (!name.trim()) return;
                  createSetup(name);
                  setName("");
                }}
              >
                New Setup
              </button>
            </div>
          </div>

          <div className="card database-card">
            <div className="database-card-title">Example Setups</div>
            <p className="dashboard-text">
              Load presets populated with the Helios reference numbers for suspension, tire pressures, aero, and weather.
            </p>
            <button
              className="secondary-action"
              onClick={() => loadExampleSetups()}
            >
              Load Example Setups
            </button>
          </div>

          <div className="card database-card">
            <div className="database-card-title">Compare Setups</div>
            <p className="dashboard-text">
              The compare sheet reads from saved setups in this database. Open compare to edit a setup and return here when you are done.
            </p>
            <div className="database-inline-form">
              <button
                className="secondary-action"
                onClick={() => navigate("/compare")}
              >
                Open Compare
              </button>
              <button
                className="secondary-action"
                onClick={() => loadExampleSetups()}
              >
                Seed Compare Setups
              </button>
            </div>
          </div>

          <div className="card database-card">
            <div className="database-card-title">Manage Catalog</div>
            <div className="database-catalog-grid">
              <label className="field">
                <span>Track</span>
                <input value={trackName} onChange={(e) => setTrackName(e.target.value)} placeholder="Add track" />
              </label>
              <label className="field">
                <span>Driver</span>
                <input value={driverName} onChange={(e) => setDriverName(e.target.value)} placeholder="Add driver" />
              </label>
              <label className="field">
                <span>Car</span>
                <input value={carName} onChange={(e) => setCarName(e.target.value)} placeholder="Add car" />
              </label>
            </div>
            <div className="database-inline-form">
              <button
                className="secondary-action"
                onClick={() => {
                  if (trackName.trim()) {
                    catalog.addTrack(trackName.trim());
                    setTrackName("");
                  }
                  if (driverName.trim()) {
                    catalog.addDriver(driverName.trim());
                    setDriverName("");
                  }
                  if (carName.trim()) {
                    catalog.addCar(carName.trim());
                    setCarName("");
                  }
                  refreshCatalog();
                }}
              >
                Save Catalog Entries
              </button>
            </div>
          </div>

          <div className="card database-card">
            <div className="database-card-title">Catalog Preview</div>
            <div className="catalog-columns" key={catalogVersion}>
              <div className="catalog-column">
                <h3>Tracks</h3>
                <ul>
                  {catalogState.tracks.map((entry) => (
                    <li key={entry.id} style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <span>{entry.name}</span>
                      <button className="catalog-delete" onClick={() => {
                        catalog.removeTrack(entry.id);
                        refreshCatalog();
                      }}>
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="catalog-column">
                <h3>Drivers</h3>
                <ul>
                  {catalogState.drivers.map((entry) => (
                    <li key={entry.id} style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <span>{entry.name}</span>
                      <button className="catalog-delete" onClick={() => {
                        catalog.removeDriver(entry.id);
                        refreshCatalog();
                      }}>
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="catalog-column">
                <h3>Cars</h3>
                <ul>
                  {catalogState.cars.map((entry) => (
                    <li key={entry.id} style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <span>{entry.name}</span>
                      <button className="catalog-delete" onClick={() => {
                        catalog.removeCar(entry.id);
                        refreshCatalog();
                      }}>
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="card database-card">
            <div className="database-card-title">Tire Inventory</div>
            <div className="database-tire-grid">
              <label className="field">
                <span>Tire Set ID</span>
                <input value={tireSetId} onChange={(e) => setTireSetId(e.target.value)} placeholder="SET-01" />
              </label>
              <label className="field">
                <span>Compound</span>
                <input value={tireCompound} onChange={(e) => setTireCompound(e.target.value)} placeholder="Hoosier R25B" />
              </label>
              <label className="field">
                <span>Condition</span>
                <select value={tireCondition} onChange={(e) => setTireCondition(e.target.value)}>
                  <option value="dry">dry</option>
                  <option value="wet">wet</option>
                  <option value="comp">comp</option>
                </select>
              </label>
              <label className="field">
                <span>Notes</span>
                <input value={tireNotes} onChange={(e) => setTireNotes(e.target.value)} placeholder="Optional notes" />
              </label>
            </div>

            <div className="database-inline-form">
              <button
                className="secondary-action"
                onClick={() => {
                  if (!tireSetId.trim()) return;

                  catalog.addTire({
                    tireSetId: tireSetId.trim(),
                    compound: tireCompound.trim() || "Unknown",
                    condition: tireCondition.trim() || "dry",
                    notes: tireNotes.trim() || undefined,
                  });

                  setTireSetId("");
                  setTireCompound("Hoosier R25B");
                  setTireCondition("dry");
                  setTireNotes("");
                  refreshCatalog();
                }}
              >
                Add Tire Set
              </button>
            </div>

            <div className="database-tire-list" key={`tires-${catalogVersion}`}>
              {catalogState.tires.length === 0 ? (
                <p className="dashboard-text">No tire sets in inventory yet.</p>
              ) : (
                catalogState.tires.map((tire) => (
                  <div key={tire.id} className="database-tire-row">
                    <div className="database-tire-main">
                      <strong>{tire.tireSetId}</strong>
                      <span>{tire.compound}</span>
                      <span>{tire.condition}</span>
                    </div>
                    <button
                      className="catalog-delete"
                      onClick={() => {
                        catalog.removeTire(tire.id);
                        refreshCatalog();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card database-card">
            <div className="database-card-title">Saved Setups</div>
            <SearchBar value={search} onChange={setSearch} />
            <div className="saved-setups-strip">
              {filtered.map((setup) => (
                <SetupRow
                  key={setup.id}
                  setup={setup}
                  onOpen={() => {
                    openSetup(setup.id);
                    navigate("/editor", { state: { returnTo: "/database" } });
                  }}
                  onDuplicate={() => duplicateSetup(setup.id)}
                  onDelete={() => deleteSetup(setup.id)}
                />
              ))}
            </div>
          </div>

          <div className="card database-card">
            <div className="database-card-title">Linked MoTeC CSV</div>
            <p className="dashboard-text">
              Upload a MoTeC CSV and link it to a setup so telemetry references stay with the setup database.
            </p>

            <div className="database-inline-form">
              <select
                value={selectedSetupId}
                onChange={(event) => setSelectedSetupId(event.target.value)}
                style={{ minWidth: 280 }}
              >
                <option value="">Select setup...</option>
                {setups.map((setup) => (
                  <option key={setup.id} value={setup.id}>{setup.name}</option>
                ))}
              </select>
              <button
                className="secondary-action"
                onClick={() => motecFileInputRef.current?.click()}
              >
                Link MoTeC CSV
              </button>
              <input
                ref={motecFileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="runs-hidden-file-input"
                onChange={handleLinkMotecCsv}
              />
            </div>

            {motecLinkMessage && <p className="runs-import-message">{motecLinkMessage}</p>}

            {catalogState.motecCsv.length === 0 ? (
              <p className="dashboard-text">No MoTeC files linked yet.</p>
            ) : (
              <div className="database-motec-list" key={`motec-${catalogVersion}`}>
                {catalogState.motecCsv.map((entry) => (
                  <div key={entry.id} className="database-motec-row">
                    <div className="database-motec-main">
                      <strong>{entry.fileName}</strong>
                      <span>{entry.setupName}</span>
                      <span>{entry.lapCount} laps</span>
                      <span>{entry.sampleCount} samples</span>
                      <span>
                        Best {entry.bestLap == null ? "--" : `${entry.bestLap.toFixed(3)} s`}
                      </span>
                    </div>
                    <button
                      className="catalog-delete"
                      onClick={() => {
                        catalog.removeSetupMotecCsv(entry.id);
                        refreshCatalog();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
