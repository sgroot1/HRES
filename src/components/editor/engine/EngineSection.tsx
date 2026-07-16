import EngineControlsPanel from "./EngineControlsPanel";
import EngineCalibrationPanel from "./EngineCalibrationPanel";
import EngineNotesPanel from "./EngineNotesPanel";

export default function EngineSection() {

  return (
    <div className="module-sheet">
      <div className="compare-header suspension-header">
        <div>
          <div className="compare-kicker">Engine Sheet</div>
          <h1>Engine</h1>
        </div>

        <div className="compare-header-meta suspension-meta">
          <span>controls</span>
          <span>calibration</span>
          <span>notes</span>
        </div>
      </div>

      <div className="general-grid module-sheet-grid">

        <EngineControlsPanel />

        <EngineCalibrationPanel />

        <EngineNotesPanel />

      </div>

    </div>

  );

}
