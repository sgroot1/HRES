import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSetupStore } from "../store/setupStore";
import type { Setup } from "../types/setup";

const visibleSetups = 8;

function valueText(value: unknown) {
  return value == null || value === "" ? "--" : String(value);
}

function boolText(value: unknown) {
  return value ? "Enabled" : "Disabled";
}

function compareSectionHead(title: string) {
  return (
    <div className="compare-sheet-row compare-section-row">
      <div className="compare-section-head">{title}</div>
      <div className="compare-section-fill" />
    </div>
  );
}

function singleValueRow(left: unknown, right: unknown, highlightRight = false) {
  return (
    <>
      <div className="compare-single-value">{valueText(left)}</div>
      <div className={highlightRight ? "compare-single-value highlight" : "compare-single-value"}>
        {valueText(right)}
      </div>
    </>
  );
}

function quadBlock(values: [unknown, unknown, unknown, unknown], highlight = false) {
  return (
    <div className={highlight ? "compare-corner-block highlight" : "compare-corner-block"}>
      <div className="compare-corner-row">{valueText(values[0])}</div>
      <div className="compare-corner-row">{valueText(values[1])}</div>
      <div className="compare-corner-row">{valueText(values[2])}</div>
      <div className="compare-corner-row">{valueText(values[3])}</div>
    </div>
  );
}

function compareRow({
  label,
  left,
  right,
  highlightRight = false,
}: {
  label: string;
  left: unknown;
  right: unknown;
  highlightRight?: boolean;
}) {
  return (
    <div className="compare-sheet-row compare-values-row compare-weight-row">
      <div className="compare-sticky-label">{label}</div>
      {singleValueRow(left, right, highlightRight)}
    </div>
  );
}

function compareQuadRow({
  label,
  left,
  right,
  highlightRight = false,
}: {
  label: string;
  left: [unknown, unknown, unknown, unknown];
  right: [unknown, unknown, unknown, unknown];
  highlightRight?: boolean;
}) {
  return (
    <div className="compare-sheet-row compare-values-row compare-weight-row compare-alignment-row">
      <div className="compare-sticky-label">{label}</div>
      <div className="compare-corner-cell">{quadBlock(left)}</div>
      <div className={highlightRight ? "compare-corner-cell active" : "compare-corner-cell"}>
        {quadBlock(right, highlightRight)}
      </div>
    </div>
  );
}

export default function SetupCompare() {
  const setups = useSetupStore((state) => state.setups);
  const openSetup = useSetupStore((state) => state.openSetup);
  const navigate = useNavigate();

  const [leftId, setLeftId] = useState("");
  const [rightId, setRightId] = useState("");

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

  const handleOpenDatabase = () => {
    navigate("/database");
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

        <button className="primary-action compare-new-setup" onClick={handleOpenDatabase}>
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
                <button className="compare-setup-edit" onClick={() => handleEditSetup(setup)}>
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

          {compareSectionHead("General")}
          {compareRow({
            label: "Driver",
            left: left.general.driver,
            right: right.general.driver,
          })}
          {compareRow({
            label: "Engineer",
            left: left.general.engineer,
            right: right.general.engineer,
          })}
          {compareRow({
            label: "Track",
            left: left.general.track,
            right: right.general.track,
          })}
          {compareRow({
            label: "Event",
            left: left.general.event,
            right: right.general.event,
          })}
          {compareRow({
            label: "Weather",
            left: left.general.weather,
            right: right.general.weather,
          })}

          {compareSectionHead("Weight")}
          {compareQuadRow({
            label: "Corner Weights (Lbs)",
            left: [
              left.suspension.lf.cornerWeight,
              left.suspension.rf.cornerWeight,
              left.suspension.lr.cornerWeight,
              left.suspension.rr.cornerWeight,
            ],
            right: [
              right.suspension.lf.cornerWeight,
              right.suspension.rf.cornerWeight,
              right.suspension.lr.cornerWeight,
              right.suspension.rr.cornerWeight,
            ],
            highlightRight: true,
          })}
          {compareRow({
            label: "Total Weight (Lbs)",
            left:
              left.suspension.lf.cornerWeight ??
              left.suspension.rf.cornerWeight ??
              left.suspension.lr.cornerWeight ??
              left.suspension.rr.cornerWeight,
            right:
              right.suspension.lf.cornerWeight ??
              right.suspension.rf.cornerWeight ??
              right.suspension.lr.cornerWeight ??
              right.suspension.rr.cornerWeight,
            highlightRight: true,
          })}

          {compareSectionHead("Alignment")}
          {compareQuadRow({
            label: "Camber (°)",
            left: [
              left.suspension.lf.camber,
              left.suspension.rf.camber,
              left.suspension.lr.camber,
              left.suspension.rr.camber,
            ],
            right: [
              right.suspension.lf.camber,
              right.suspension.rf.camber,
              right.suspension.lr.camber,
              right.suspension.rr.camber,
            ],
          })}
          {compareQuadRow({
            label: "Toe (°)",
            left: [
              left.suspension.lf.toe,
              left.suspension.rf.toe,
              left.suspension.lr.toe,
              left.suspension.rr.toe,
            ],
            right: [
              right.suspension.lf.toe,
              right.suspension.rf.toe,
              right.suspension.lr.toe,
              right.suspension.rr.toe,
            ],
          })}
          {compareQuadRow({
            label: "Ride Height (In)",
            left: [
              left.suspension.lf.rideHeight,
              left.suspension.rf.rideHeight,
              left.suspension.lr.rideHeight,
              left.suspension.rr.rideHeight,
            ],
            right: [
              right.suspension.lf.rideHeight,
              right.suspension.rf.rideHeight,
              right.suspension.lr.rideHeight,
              right.suspension.rr.rideHeight,
            ],
          })}
          {compareQuadRow({
            label: "Caster (°)",
            left: [
              left.suspension.lf.caster,
              left.suspension.rf.caster,
              left.suspension.lr.caster,
              left.suspension.rr.caster,
            ],
            right: [
              right.suspension.lf.caster,
              right.suspension.rf.caster,
              right.suspension.lr.caster,
              right.suspension.rr.caster,
            ],
          })}

          {compareSectionHead("Springs")}
          {compareQuadRow({
            label: "Spring Rate",
            left: [
              left.suspension.lf.springRate,
              left.suspension.rf.springRate,
              left.suspension.lr.springRate,
              left.suspension.rr.springRate,
            ],
            right: [
              right.suspension.lf.springRate,
              right.suspension.rf.springRate,
              right.suspension.lr.springRate,
              right.suspension.rr.springRate,
            ],
          })}
          {compareQuadRow({
            label: "Spring Preload",
            left: [
              left.suspension.lf.springPreload,
              left.suspension.rf.springPreload,
              left.suspension.lr.springPreload,
              left.suspension.rr.springPreload,
            ],
            right: [
              right.suspension.lf.springPreload,
              right.suspension.rf.springPreload,
              right.suspension.lr.springPreload,
              right.suspension.rr.springPreload,
            ],
          })}

          {compareSectionHead("Dampers")}
          {compareQuadRow({
            label: "Low Speed Bump",
            left: [
              left.suspension.lf.lowSpeedBump,
              left.suspension.rf.lowSpeedBump,
              left.suspension.lr.lowSpeedBump,
              left.suspension.rr.lowSpeedBump,
            ],
            right: [
              right.suspension.lf.lowSpeedBump,
              right.suspension.rf.lowSpeedBump,
              right.suspension.lr.lowSpeedBump,
              right.suspension.rr.lowSpeedBump,
            ],
          })}
          {compareQuadRow({
            label: "High Speed Bump",
            left: [
              left.suspension.lf.highSpeedBump,
              left.suspension.rf.highSpeedBump,
              left.suspension.lr.highSpeedBump,
              left.suspension.rr.highSpeedBump,
            ],
            right: [
              right.suspension.lf.highSpeedBump,
              right.suspension.rf.highSpeedBump,
              right.suspension.lr.highSpeedBump,
              right.suspension.rr.highSpeedBump,
            ],
          })}
          {compareQuadRow({
            label: "Low Speed Rebound",
            left: [
              left.suspension.lf.lowSpeedRebound,
              left.suspension.rf.lowSpeedRebound,
              left.suspension.lr.lowSpeedRebound,
              left.suspension.rr.lowSpeedRebound,
            ],
            right: [
              right.suspension.lf.lowSpeedRebound,
              right.suspension.rf.lowSpeedRebound,
              right.suspension.lr.lowSpeedRebound,
              right.suspension.rr.lowSpeedRebound,
            ],
          })}
          {compareQuadRow({
            label: "High Speed Rebound",
            left: [
              left.suspension.lf.highSpeedRebound,
              left.suspension.rf.highSpeedRebound,
              left.suspension.lr.highSpeedRebound,
              left.suspension.rr.highSpeedRebound,
            ],
            right: [
              right.suspension.lf.highSpeedRebound,
              right.suspension.rf.highSpeedRebound,
              right.suspension.lr.highSpeedRebound,
              right.suspension.rr.highSpeedRebound,
            ],
          })}

          {compareSectionHead("Brakes")}
          {compareQuadRow({
            label: "Rotor Temperature",
            left: [
              left.brakes.lf.rotorTemperature,
              left.brakes.rf.rotorTemperature,
              left.brakes.lr.rotorTemperature,
              left.brakes.rr.rotorTemperature,
            ],
            right: [
              right.brakes.lf.rotorTemperature,
              right.brakes.rf.rotorTemperature,
              right.brakes.lr.rotorTemperature,
              right.brakes.rr.rotorTemperature,
            ],
          })}
          {compareQuadRow({
            label: "Pad Thickness",
            left: [
              left.brakes.lf.padThickness,
              left.brakes.rf.padThickness,
              left.brakes.lr.padThickness,
              left.brakes.rr.padThickness,
            ],
            right: [
              right.brakes.lf.padThickness,
              right.brakes.rf.padThickness,
              right.brakes.lr.padThickness,
              right.brakes.rr.padThickness,
            ],
          })}
          {compareQuadRow({
            label: "Brake Pressure",
            left: [
              left.brakes.lf.brakePressure,
              left.brakes.rf.brakePressure,
              left.brakes.lr.brakePressure,
              left.brakes.rr.brakePressure,
            ],
            right: [
              right.brakes.lf.brakePressure,
              right.brakes.rf.brakePressure,
              right.brakes.lr.brakePressure,
              right.brakes.rr.brakePressure,
            ],
          })}
          {compareQuadRow({
            label: "Brake Wear",
            left: [
              left.brakes.lf.brakeWear,
              left.brakes.rf.brakeWear,
              left.brakes.lr.brakeWear,
              left.brakes.rr.brakeWear,
            ],
            right: [
              right.brakes.lf.brakeWear,
              right.brakes.rf.brakeWear,
              right.brakes.lr.brakeWear,
              right.brakes.rr.brakeWear,
            ],
          })}
          {compareRow({
            label: "Front Bias",
            left: left.brakes.frontBias,
            right: right.brakes.frontBias,
          })}
          {compareRow({
            label: "Rear Bias",
            left: left.brakes.rearBias,
            right: right.brakes.rearBias,
          })}
          {compareRow({
            label: "Master Cylinder",
            left: left.brakes.masterCylinder,
            right: right.brakes.masterCylinder,
          })}
          {compareRow({
            label: "Pedal Ratio",
            left: left.brakes.pedalRatio,
            right: right.brakes.pedalRatio,
          })}

          {compareSectionHead("Tires")}
          {compareQuadRow({
            label: "Cold Pressure",
            left: [
              left.tires.lf.coldPressure,
              left.tires.rf.coldPressure,
              left.tires.lr.coldPressure,
              left.tires.rr.coldPressure,
            ],
            right: [
              right.tires.lf.coldPressure,
              right.tires.rf.coldPressure,
              right.tires.lr.coldPressure,
              right.tires.rr.coldPressure,
            ],
          })}
          {compareQuadRow({
            label: "Hot Pressure",
            left: [
              left.tires.lf.hotPressure,
              left.tires.rf.hotPressure,
              left.tires.lr.hotPressure,
              left.tires.rr.hotPressure,
            ],
            right: [
              right.tires.lf.hotPressure,
              right.tires.rf.hotPressure,
              right.tires.lr.hotPressure,
              right.tires.rr.hotPressure,
            ],
          })}
          {compareQuadRow({
            label: "Final Pressure",
            left: [
              left.tires.lf.finalPressure,
              left.tires.rf.finalPressure,
              left.tires.lr.finalPressure,
              left.tires.rr.finalPressure,
            ],
            right: [
              right.tires.lf.finalPressure,
              right.tires.rf.finalPressure,
              right.tires.lr.finalPressure,
              right.tires.rr.finalPressure,
            ],
          })}
          {compareQuadRow({
            label: "Inside Temp",
            left: [
              left.tires.lf.insideTemp,
              left.tires.rf.insideTemp,
              left.tires.lr.insideTemp,
              left.tires.rr.insideTemp,
            ],
            right: [
              right.tires.lf.insideTemp,
              right.tires.rf.insideTemp,
              right.tires.lr.insideTemp,
              right.tires.rr.insideTemp,
            ],
          })}
          {compareQuadRow({
            label: "Middle Temp",
            left: [
              left.tires.lf.middleTemp,
              left.tires.rf.middleTemp,
              left.tires.lr.middleTemp,
              left.tires.rr.middleTemp,
            ],
            right: [
              right.tires.lf.middleTemp,
              right.tires.rf.middleTemp,
              right.tires.lr.middleTemp,
              right.tires.rr.middleTemp,
            ],
          })}
          {compareQuadRow({
            label: "Outside Temp",
            left: [
              left.tires.lf.outsideTemp,
              left.tires.rf.outsideTemp,
              left.tires.lr.outsideTemp,
              left.tires.rr.outsideTemp,
            ],
            right: [
              right.tires.lf.outsideTemp,
              right.tires.rf.outsideTemp,
              right.tires.lr.outsideTemp,
              right.tires.rr.outsideTemp,
            ],
          })}
          {compareQuadRow({
            label: "Wear",
            left: [
              left.tires.lf.wear,
              left.tires.rf.wear,
              left.tires.lr.wear,
              left.tires.rr.wear,
            ],
            right: [
              right.tires.lf.wear,
              right.tires.rf.wear,
              right.tires.lr.wear,
              right.tires.rr.wear,
            ],
          })}
          {compareQuadRow({
            label: "Heat Cycles",
            left: [
              left.tires.lf.heatCycles,
              left.tires.rf.heatCycles,
              left.tires.lr.heatCycles,
              left.tires.rr.heatCycles,
            ],
            right: [
              right.tires.lf.heatCycles,
              right.tires.rf.heatCycles,
              right.tires.lr.heatCycles,
              right.tires.rr.heatCycles,
            ],
          })}

          {compareSectionHead("Engine")}
          {compareRow({
            label: "Throttle Map",
            left: left.engine.throttleMap,
            right: right.engine.throttleMap,
          })}
          {compareRow({
            label: "Fuel Map",
            left: left.engine.fuelMap,
            right: right.engine.fuelMap,
          })}
          {compareRow({
            label: "Rev Limit",
            left: left.engine.revLimit,
            right: right.engine.revLimit,
          })}
          {compareRow({
            label: "Engine Brake",
            left: left.engine.engineBrake,
            right: right.engine.engineBrake,
          })}
          {compareRow({
            label: "Launch Control",
            left: boolText(left.engine.launchControl),
            right: boolText(right.engine.launchControl),
          })}
          {compareRow({
            label: "Traction Control",
            left: boolText(left.engine.tractionControl),
            right: boolText(right.engine.tractionControl),
          })}
          {compareRow({
            label: "Shift Light",
            left: left.engine.shiftLight,
            right: right.engine.shiftLight,
          })}
          {compareRow({
            label: "Pit Limiter",
            left: boolText(left.engine.pitLimiter),
            right: boolText(right.engine.pitLimiter),
          })}
        </div>
      )}
    </div>
  );
}
