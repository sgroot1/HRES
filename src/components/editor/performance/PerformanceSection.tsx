import DriverPanel from "./DriverPanel";
import EngineerPanel from "./EngineerPanel";
import AnalysisPanel from "./AnalysisPanel";

export default function PerformanceSection() {

  return (
    <div className="module-sheet">
      <div className="compare-header suspension-header">
        <div>
          <div className="compare-kicker">Performance Sheet</div>
          <h1>Performance</h1>
        </div>

        <div className="compare-header-meta suspension-meta">
          <span>driver</span>
          <span>engineer</span>
          <span>analysis</span>
        </div>
      </div>

      <div className="general-grid module-sheet-grid">

        <DriverPanel />

        <EngineerPanel />

        <AnalysisPanel />

      </div>

    </div>

  );

}
