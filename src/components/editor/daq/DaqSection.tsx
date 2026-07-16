import TelemetryPanel from "./TelemetryPanel";
import SensorPanel from "./SensorPanel";
import DaqNotesPanel from "./DaqNotesPanel";

export default function DaqSection() {

  return (
    <div className="module-sheet">
      <div className="compare-header suspension-header">
        <div>
          <div className="compare-kicker">DAQ Sheet</div>
          <h1>Data Acquisition</h1>
        </div>

        <div className="compare-header-meta suspension-meta">
          <span>telemetry</span>
          <span>sensors</span>
          <span>notes</span>
        </div>
      </div>

      <div className="general-grid module-sheet-grid">

        <TelemetryPanel />

        <SensorPanel />

        <DaqNotesPanel />

      </div>

    </div>

  );

}
