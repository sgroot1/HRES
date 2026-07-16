import DiffCorePanel from "./DiffCorePanel";
import DiffRampPanel from "./DiffRampPanel";
import DiffNotesPanel from "./DiffNotesPanel";

export default function DrivetrainSection() {
  return (
    <div className="module-sheet">
      <div className="compare-header suspension-header">
        <div>
          <div className="compare-kicker">Diff Sheet</div>
          <h1>Differential</h1>
        </div>

        <div className="compare-header-meta suspension-meta">
          <span>core</span>
          <span>ramp</span>
          <span>notes</span>
        </div>
      </div>

      <div className="general-grid module-sheet-grid">
        <DiffCorePanel />
        <DiffRampPanel />
        <DiffNotesPanel />
      </div>
    </div>
  );
}
