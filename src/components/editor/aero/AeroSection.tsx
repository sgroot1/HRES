import FrontAeroPanel from "./FrontAeroPanel";
import RearAeroPanel from "./RearAeroPanel";
import AeroAnalysisPanel from "./AeroAnalysisPanel";

export default function AeroSection() {

  return (
    <div className="module-sheet">
      <div className="compare-header suspension-header">
        <div>
          <div className="compare-kicker">Aero Sheet</div>
          <h1>Aerodynamics</h1>
        </div>

        <div className="compare-header-meta suspension-meta">
          <span>front</span>
          <span>rear</span>
          <span>analysis</span>
        </div>
      </div>

      <div className="general-grid module-sheet-grid">

        <FrontAeroPanel />

        <RearAeroPanel />

        <AeroAnalysisPanel />

      </div>

    </div>

  );

}
