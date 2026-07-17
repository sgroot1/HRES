import { useCatalogStore } from "../../../data/catalog";
import { useTires } from "../../../hooks/useTires";
import GeometryPanel from "./GeometryPanel";
import SpringPanel from "./SpringPanel";
import DamperPanel from "./DamperPanel";
import { useSuspension } from "../../../hooks/useSuspension";

export default function SuspensionSection() {

  const { suspension } = useSuspension();
  const { tires, update: updateTires } = useTires();
  const tireInventory = useCatalogStore((state) => state.tires);

  const updateTirePressure = (corner: "lf" | "rf" | "lr" | "rr", value: string) => {
    if (!tires) return;

    const parsed = value === "" ? null : Number(value);

    updateTires({
      [corner]: {
        ...tires[corner],
        coldPressure: Number.isFinite(parsed as number) ? parsed : null,
      },
    });
  };

  return (

    <div className="suspension-sheet">

      <div className="compare-header suspension-header">

        <div>

          <div className="compare-kicker">Suspension Sheet</div>

          <h1>Suspension</h1>

        </div>

        <div className="compare-header-meta suspension-meta">

          <span>geometry</span>

          <span>springs</span>

          <span>arb</span>

          <span>dampers</span>

        </div>

      </div>

      <div className="suspension-layout">

        <div className="suspension-main-grid">

          <GeometryPanel />

          <SpringPanel />

          <DamperPanel />

        </div>

        <div className="suspension-side-grid">

          <div className="corner-panel suspension-tire-panel">
            <h2>Tire Set In Use</h2>

            <div className="suspension-mini-grid suspension-tire-grid">
              <label className="suspension-mini-label" htmlFor="suspension-tire-select">
                Inventory Tire Set
              </label>
              <select
                id="suspension-tire-select"
                className="suspension-tire-select"
                value={tires?.inventoryTireId ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  updateTires({ inventoryTireId: value || null });
                }}
              >
                <option value="">Not selected</option>
                {tireInventory.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.tireSetId} - {entry.compound} ({entry.condition})
                  </option>
                ))}
              </select>

              <div className="suspension-mini-label">Tire PSI (Per Setup)</div>
              <div className="suspension-tire-psi-grid">
                <label>
                  <span>LF</span>
                  <input
                    type="number"
                    value={tires?.lf.coldPressure ?? ""}
                    onChange={(event) => updateTirePressure("lf", event.target.value)}
                  />
                </label>
                <label>
                  <span>RF</span>
                  <input
                    type="number"
                    value={tires?.rf.coldPressure ?? ""}
                    onChange={(event) => updateTirePressure("rf", event.target.value)}
                  />
                </label>
                <label>
                  <span>LR</span>
                  <input
                    type="number"
                    value={tires?.lr.coldPressure ?? ""}
                    onChange={(event) => updateTirePressure("lr", event.target.value)}
                  />
                </label>
                <label>
                  <span>RR</span>
                  <input
                    type="number"
                    value={tires?.rr.coldPressure ?? ""}
                    onChange={(event) => updateTirePressure("rr", event.target.value)}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="corner-panel suspension-arb-panel">

            <h2>ARB</h2>

            <div className="suspension-mini-grid">

              <div className="suspension-mini-label">Front ARB</div>
              <div className="suspension-mini-value">{suspension?.frontArb ?? "--"}</div>

              <div className="suspension-mini-label">Rear ARB</div>
              <div className="suspension-mini-value">{suspension?.rearArb ?? "--"}</div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
