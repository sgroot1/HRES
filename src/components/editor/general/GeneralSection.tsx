import SetupInfoCard from "./SetupInfoCard";
import SessionCard from "./SessionCard";
import WeatherCard from "./WeatherCard";

export default function GeneralSection() {

  return (
    <div className="module-sheet">
      <div className="compare-header suspension-header">
        <div>
          <div className="compare-kicker">General Sheet</div>
          <h1>General</h1>
        </div>

        <div className="compare-header-meta suspension-meta">
          <span>setup</span>
          <span>session</span>
          <span>weather</span>
        </div>
      </div>

      <div className="general-grid general-grid-split module-sheet-grid">

        <SetupInfoCard />

        <div className="general-side-stack">

          <SessionCard />

          <WeatherCard />

        </div>

      </div>

    </div>

  );

}
