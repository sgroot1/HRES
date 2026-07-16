import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSetupStore } from "../store/setupStore";
import type { Setup } from "../types/setup";

const visibleSetups = 8;
const damperOptions = Array.from({ length: 31 }, (_, index) => String(index));

function valueText(value: unknown) {
  return value == null || value === "" ? "--" : String(value);
}

function compareSectionHead(title: string) {
  return (
    <div className="compare-sheet-row compare-section-row">
      <div className="compare-section-head">{title}</div>
      <div className="compare-section-fill" />
    </div>
  );
}

function cornerBlock(setup: Setup, highlight = false) {
  return (
    <div className={highlight ? "compare-corner-block highlight" : "compare-corner-block"}>
      <div className="compare-corner-row">{valueText(setup.suspension.lf.cornerWeight)}</div>
      <div className="compare-corner-row">{valueText(setup.suspension.rf.cornerWeight)}</div>
      <div className="compare-corner-row">{valueText(setup.suspension.lr.cornerWeight)}</div>
      <div className="compare-corner-row">{valueText(setup.suspension.rr.cornerWeight)}</div>
    </div>
  );
}

function fourCornerMetric(values: [unknown, unknown, unknown, unknown], highlight = false) {
  return (
    <div className={highlight ? "compare-corner-block highlight" : "compare-corner-block"}>
      <div className="compare-corner-row">{valueText(values[0])}</div>
      <div className="compare-corner-row">{valueText(values[1])}</div>
      <div className="compare-corner-row">{valueText(values[2])}</div>
      <div className="compare-corner-row">{valueText(values[3])}</div>
    </div>
  );
}

function matrixBlock(values: [unknown, unknown, unknown, unknown], highlight = false) {
  return (
    <div className={highlight ? "compare-matrix-block highlight" : "compare-matrix-block"}>
      <div className="compare-matrix-cell">{valueText(values[0])}</div>
      <div className="compare-matrix-cell">{valueText(values[1])}</div>
      <div className="compare-matrix-cell">{valueText(values[2])}</div>
      <div className="compare-matrix-cell">{valueText(values[3])}</div>
    </div>
  );
}

function damperBlock(setupId: string, index: number, highlight = false) {
  const rowLabels = ["FL", "FR", "RL", "RR"];
  const columnLabels = ["LSB", "HSB", "LSR", "HSR"];

  const valueFor = (rowIndex: number, columnIndex: number) => {
    const baseValues = [8, 6, 10, 7];
    const highlightedValues = [5, 6, 7, 7];
    const values = index === 1 ? highlightedValues : baseValues;

    if (columnIndex === 1) return 6;
    if (columnIndex === 3) return 7;
    return values[columnIndex];
  };

  return (
    <div
      key={setupId}
      className={highlight ? "compare-damper-matrix highlight" : "compare-damper-matrix"}
    >
      <div className="compare-damper-header-row">
        <div className="compare-damper-header-spacer" />
        {columnLabels.map((label) => (
          <div key={label} className="compare-damper-header-cell">
            {label}
          </div>
        ))}
      </div>

      {rowLabels.map((rowLabel, rowIndex) => (
        <div key={rowLabel} className="compare-damper-value-row">
          <div className="compare-damper-row-label">{rowLabel}</div>
          {columnLabels.map((columnLabel, columnIndex) => {
            const value = valueFor(rowIndex, columnIndex);

            return (
              <select
                key={`${rowLabel}-${columnLabel}`}
                className="compare-damper-cell"
                defaultValue={String(value)}
              >
                {damperOptions.map((option) => (
                  <option key={`${rowLabel}-${columnLabel}-${option}`} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function SetupCompare() {
  const setups = useSetupStore((state) => state.setups);
  const openSetup = useSetupStore((state) => state.openSetup);
  const loadExampleSetups = useSetupStore((state) => state.loadExampleSetups);
  const navigate = useNavigate();

  const [leftId, setLeftId] = useState("");
  const [rightId, setRightId] = useState("");

  useEffect(() => {
    if (!setups.length) {
      loadExampleSetups();
    }
  }, [loadExampleSetups, setups.length]);

  useEffect(() => {
    if (!leftId && setups[0]) {
      setLeftId(setups[0].id);
    }

    if ((!rightId || rightId === leftId) && setups[1]) {
      setRightId(setups[1].id);
    }
  }, [setups, leftId, rightId]);

  const comparisonSetups = useMemo(() => {
    return setups.slice(0, visibleSetups);
  }, [setups]);

  const left = useMemo(
    () => setups.find((s) => s.id === leftId) ?? null,
    [setups, leftId]
  );

  const right = useMemo(
    () => setups.find((s) => s.id === rightId) ?? null,
    [setups, rightId]
  );

  const handleEditSetup = (setup: Setup) => {
    openSetup(setup.id);
    navigate("/workspace");
  };

  return (
    <div className="compare-shell compare-sheet-shell">
      <div className="compare-header compare-sheet-header">
        <div>
          <div className="compare-kicker">Setup Sheet</div>
          <h1>Setup Compare</h1>
        </div>
        <div className="compare-header-meta">
          <span>vs previous</span>
          <span>vs baseline</span>
          <span>changed vs previous</span>
          <span>bump</span>
          <span>rebound</span>
        </div>
      </div>

      <div className="compare-sheet-toolbar">
        <select
          className="compare-select"
          value={leftId}
          onChange={(e) => setLeftId(e.target.value)}
        >
          <option value="">Left setup</option>
          {comparisonSetups.map((setup) => (
            <option key={setup.id} value={setup.id}>
              {setup.name} v{setup.version}
            </option>
          ))}
        </select>

        <select
          className="compare-select"
          value={rightId}
          onChange={(e) => setRightId(e.target.value)}
        >
          <option value="">Right setup</option>
          {comparisonSetups.map((setup) => (
            <option key={setup.id} value={setup.id}>
              {setup.name} v{setup.version}
            </option>
          ))}
        </select>

        <button
          className="primary-action compare-new-setup"
          onClick={() => navigate("/database")}
        >
          Open Database
        </button>
      </div>

      {!left || !right ? (
        <div className="recent-placeholder">
          Create at least two setups in the database to compare them.
        </div>
      ) : (
        <div className="compare-sheet">
          <div className="compare-sheet-row compare-sheet-top-row">
            <div className="compare-sticky-label">Setup</div>
            {[left, right].map((setup, index) => (
              <div
                key={setup.id}
                className={index === 0 ? "compare-setup-column active" : "compare-setup-column"}
              >
                <div className="compare-version-pill">v{setup.version}</div>
                <div className="compare-setup-date">
                  {new Date(setup.createdAt).toLocaleDateString()}
                </div>
                <div className="compare-setup-name">{setup.name}</div>
                <div className="compare-setup-event">{setup.general.event || "Autocross"}</div>
                <div className="compare-setup-track">{setup.general.track || "Track not set"}</div>
                <button
                  className="compare-setup-edit"
                  onClick={() => handleEditSetup(setup)}
                >
                  Edit setup
                </button>
              </div>
            ))}
          </div>

          <div className="compare-sheet-row compare-status-row">
            <div className="compare-sticky-label">Setup Status</div>
            {[left, right].map((setup) => (
              <div key={`${setup.id}-status`} className="compare-status-badge not-ready">
                {setup.status}
              </div>
            ))}
          </div>

          <div className="compare-sheet-row compare-status-row">
            <div className="compare-sticky-label">Setup Type</div>
            {[left, right].map((setup) => (
              <div key={`${setup.id}-type`} className="compare-status-badge dry">
                {setup.general.weather?.toUpperCase() === "WET" ? "WET" : "DRY"}
              </div>
            ))}
          </div>

          {compareSectionHead("Weight")}
          <div className="compare-sheet-row compare-values-row compare-weight-row">
            <div className="compare-sticky-label">Corner Weights (Lbs)</div>
            {[left, right].map((setup, index) => (
              <div
                key={`${setup.id}-corner-weights`}
                className={index === 0 ? "compare-corner-cell active" : "compare-corner-cell"}
              >
                {cornerBlock(setup, index === 0)}
              </div>
            ))}
          </div>

          <div className="compare-sheet-row compare-values-row compare-weight-row">
            <div className="compare-sticky-label">Total Weight (Lbs)</div>
            {[left, right].map((setup) => (
              <div key={`${setup.id}-total-weight`} className="compare-single-value">
                {setup.suspension.lf.cornerWeight ??
                  setup.suspension.rf.cornerWeight ??
                  setup.suspension.lr.cornerWeight ??
                  setup.suspension.rr.cornerWeight ??
                  "--"}
              </div>
            ))}
          </div>

          <div className="compare-sheet-row compare-values-row compare-weight-row">
            <div className="compare-sticky-label">Front Weight (%)</div>
            {[left, right].map((setup, index) => (
              <div
                key={`${setup.id}-front`}
                className={index === 0 ? "compare-single-value highlight" : "compare-single-value"}
              >
                {setup.suspension.lf.cornerWeight ? "48.5" : "45.5"}
              </div>
            ))}
          </div>

          <div className="compare-sheet-row compare-values-row compare-weight-row">
            <div className="compare-sticky-label">Left Weight (%)</div>
            {[left, right].map((setup) => (
              <div key={`${setup.id}-left`} className="compare-single-value">
                {setup.suspension.lf.cornerWeight ? "50.1" : "50.0"}
              </div>
            ))}
          </div>

          <div className="compare-sheet-row compare-values-row compare-weight-row">
            <div className="compare-sticky-label">Cross Weight (%)</div>
            {[left, right].map((setup) => (
              <div key={`${setup.id}-cross`} className="compare-single-value">
                {setup.suspension.lf.cornerWeight ? "49.8" : "50.0"}
              </div>
            ))}
          </div>

          <div className="compare-sheet-row compare-values-row compare-weight-row">
            <div className="compare-sticky-label">Fuel (%)</div>
            {[left, right].map((setup) => (
              <div key={`${setup.id}-fuel`} className="compare-single-value">
                {setup.engine.fuelMap ? "100" : "--"}
              </div>
            ))}
          </div>

          <div className="compare-sheet-row compare-values-row compare-weight-row">
            <div className="compare-sticky-label">Measured On</div>
            {[left, right].map((setup) => (
              <div key={`${setup.id}-measured`} className="compare-single-value">
                setup pad
              </div>
            ))}
          </div>

          {compareSectionHead("Tires & Alignment")}
          <div className="compare-sheet-row compare-values-row compare-weight-row compare-alignment-row">
            <div className="compare-sticky-label">Pressures (Psi)</div>
            {[left, right].map((setup, index) =>
              fourCornerMetric(
                [
                  setup.tires.lf.coldPressure,
                  setup.tires.rf.coldPressure,
                  setup.tires.lr.coldPressure,
                  setup.tires.rr.coldPressure,
                ],
                index === 1
              )
            )}
          </div>

          <div className="compare-sheet-row compare-values-row compare-weight-row compare-alignment-row">
            <div className="compare-sticky-label">Camber (°)</div>
            {[left, right].map((setup, index) =>
              fourCornerMetric(
                [
                  setup.suspension.lf.camber,
                  setup.suspension.rf.camber,
                  setup.suspension.lr.camber,
                  setup.suspension.rr.camber,
                ],
                index === 1
              )
            )}
          </div>

          <div className="compare-sheet-row compare-values-row compare-weight-row compare-alignment-row">
            <div className="compare-sticky-label">Toe (°)</div>
            {[left, right].map((setup) =>
              fourCornerMetric([
                setup.suspension.lf.toe,
                setup.suspension.rf.toe,
                setup.suspension.lr.toe,
                setup.suspension.rr.toe,
              ])
            )}
          </div>

          <div className="compare-sheet-row compare-values-row compare-weight-row compare-alignment-row">
            <div className="compare-sticky-label">Ride Heights (In)</div>
            {[left, right].map((setup) =>
              fourCornerMetric([
                setup.suspension.lf.rideHeight,
                setup.suspension.rf.rideHeight,
                setup.suspension.lr.rideHeight,
                setup.suspension.rr.rideHeight,
              ])
            )}
          </div>

          <div className="compare-sheet-row compare-values-row compare-weight-row compare-alignment-row">
            <div className="compare-sticky-label">Caster (°)</div>
            {[left, right].map((setup) =>
              fourCornerMetric([
                setup.suspension.lf.caster,
                setup.suspension.rf.caster,
                setup.suspension.lr.caster,
                setup.suspension.rr.caster,
              ])
            )}
          </div>

          <div className="compare-sheet-row compare-values-row compare-weight-row">
            <div className="compare-sticky-label">KPI (°)</div>
            {[left, right].map(() => (
              <div className="compare-single-value">8.7</div>
            ))}
          </div>

          {compareSectionHead("Springs - ARB - Roll")}
          <div className="compare-sheet-row compare-values-row compare-matrix-row">
            <div className="compare-sticky-label">Springs (Lbs/In)</div>
            {[left, right].map((setup) =>
              matrixBlock([
                setup.suspension.lf.springRate,
                setup.suspension.rf.springRate,
                setup.suspension.lr.springRate,
                setup.suspension.rr.springRate,
              ])
            )}
          </div>

          <div className="compare-sheet-row compare-values-row compare-matrix-row">
            <div className="compare-sticky-label">ARB (1-7)</div>
            {[left, right].map((setup, index) =>
              matrixBlock(
                [
                  setup.suspension.frontArb,
                  setup.suspension.rearArb,
                  setup.suspension.frontArb,
                  setup.suspension.rearArb,
                ],
                index === 1
              )
            )}
          </div>

          <div className="compare-sheet-row compare-values-row compare-weight-row">
            <div className="compare-sticky-label">Front Roll Stiffness</div>
            {[left, right].map((setup, index) => (
              <div
                key={`${setup.id}-front-roll`}
                className={index === 1 ? "compare-single-value highlight" : "compare-single-value"}
              >
                stiff
              </div>
            ))}
          </div>

          <div className="compare-sheet-row compare-values-row compare-weight-row">
            <div className="compare-sticky-label">Rear Roll Stiffness</div>
            {[left, right].map((setup, index) => (
              <div
                key={`${setup.id}-rear-roll`}
                className={index === 1 ? "compare-single-value highlight" : "compare-single-value"}
              >
                med-soft
              </div>
            ))}
          </div>

          {compareSectionHead("Dampers (0-30 Clicks)")}
          <div className="compare-sheet-row compare-values-row compare-weight-row compare-damper-row">
            <div className="compare-sticky-label">Dampers</div>
            {[left, right].map((setup, index) => damperBlock(setup.id, index, index === 1))}
          </div>

          {compareSectionHead("Tires")}
          <div className="compare-sheet-row compare-values-row compare-weight-row">
            <div className="compare-sticky-label">Compound</div>
            {[left, right].map((setup, index) => (
              <div
                key={`${setup.id}-compound`}
                className={index === 1 ? "compare-single-value highlight" : "compare-single-value"}
              >
                {setup.general.weather?.toUpperCase() === "WET" ? "Hoosier WET" : "Hoosier R25B"}
              </div>
            ))}
          </div>

          <div className="compare-sheet-row compare-values-row compare-weight-row">
            <div className="compare-sticky-label">Condition (Wet/Dry/Comp)</div>
            {[left, right].map((setup, index) => (
              <div
                key={`${setup.id}-condition`}
                className={index === 1 ? "compare-single-value highlight" : "compare-single-value"}
              >
                {setup.general.weather?.toUpperCase() === "WET" ? "wet" : "dry"}
              </div>
            ))}
          </div>

          <div className="compare-sheet-row compare-values-row compare-weight-row">
            <div className="compare-sticky-label">Tire Set ID</div>
            {[left, right].map((setup, index) => (
              <div
                key={`${setup.id}-tire-set`}
                className={index === 1 ? "compare-single-value highlight" : "compare-single-value"}
              >
                {index === 1 ? "SET-W1" : "SET-01"}
              </div>
            ))}
          </div>

          <div className="compare-sheet-row compare-values-row compare-weight-row">
            <div className="compare-sticky-label">FL Pressure (Psi)</div>
            {[left, right].map((setup, index) => (
              <div
                key={`${setup.id}-fl-pressure`}
                className={index === 1 ? "compare-single-value highlight" : "compare-single-value"}
              >
                {setup.tires.lf.coldPressure ?? 11}
              </div>
            ))}
          </div>

          <div className="compare-sheet-row compare-values-row compare-weight-row">
            <div className="compare-sticky-label">FR Pressure (Psi)</div>
            {[left, right].map((setup, index) => (
              <div
                key={`${setup.id}-fr-pressure`}
                className={index === 1 ? "compare-single-value highlight" : "compare-single-value"}
              >
                {setup.tires.rf.coldPressure ?? 11}
              </div>
            ))}
          </div>

          <div className="compare-sheet-row compare-values-row compare-weight-row">
            <div className="compare-sticky-label">RL Pressure (Psi)</div>
            {[left, right].map((setup, index) => (
              <div
                key={`${setup.id}-rl-pressure`}
                className={index === 1 ? "compare-single-value highlight" : "compare-single-value"}
              >
                {setup.tires.lr.coldPressure ?? 11.5}
              </div>
            ))}
          </div>

          <div className="compare-sheet-row compare-values-row compare-weight-row">
            <div className="compare-sticky-label">RR Pressure (Psi)</div>
            {[left, right].map((setup, index) => (
              <div
                key={`${setup.id}-rr-pressure`}
                className={index === 1 ? "compare-single-value highlight" : "compare-single-value"}
              >
                {setup.tires.rr.coldPressure ?? 11.5}
              </div>
            ))}
          </div>

          {compareSectionHead("Aero")}
          <div className="compare-sheet-row compare-values-row compare-weight-row">
            <div className="compare-sticky-label">Front Wing Config</div>
            {[left, right].map(() => (
              <div className="compare-single-value">std 3-element</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
