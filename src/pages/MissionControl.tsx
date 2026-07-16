import { useNavigate } from "react-router-dom";

import CurrentSessionCard from "../components/home/CurrentSessionCard";
import EngineeringHealth from "../components/home/EngineeringHealth";
import CurrentActivityCard from "../components/home/CurrentActivityCard";
import ModuleCard from "../components/home/ModuleCard";

export default function MissionControl() {
  const navigate = useNavigate();

  return (
    <div className="mission-control">
      <header className="mission-header">
        <h1>HRES</h1>
        <p>Helios Race Engineering Suite</p>
      </header>

      <div className="mission-dashboard">
        <CurrentSessionCard />
        <EngineeringHealth />
        <CurrentActivityCard />
      </div>

      <section className="module-section">
        <div className="section-header">
          <h2>ENGINEERING MODULES</h2>
        </div>

        <div className="module-grid">
          <ModuleCard
            title="Workspace"
            description="Edit setups, suspension, tires, brakes, engine, DAQ and aero."
            status="ACTIVE"
            onClick={() => navigate("/workspace")}
          />

          <ModuleCard
            title="Run Review"
            description="Review driver feedback, engineering notes and setup changes."
            onClick={() => navigate("/runs")}
          />

          <ModuleCard
            title="Performance Dashboard"
            description="Engineering KPIs, telemetry summaries and performance trends."
            onClick={() => navigate("/dashboard")}
          />

          <ModuleCard
            title="Setup Database"
            description="Browse, duplicate and organize engineering setups."
            onClick={() => navigate("/database")}
          />

          <ModuleCard
            title="Setup Compare"
            description="Compare two complete vehicle setups side-by-side."
            onClick={() => navigate("/compare")}
          />

          <ModuleCard
            title="Recommendation Engine"
            description="Engineering recommendations generated from testing history."
            status="UNDER DEVELOPMENT"
            disabled
          />
        </div>
      </section>

      <section className="recent-section">
        <div className="section-header">
          <h2>RECENT SESSIONS</h2>
        </div>

        <div className="recent-placeholder">
          <table className="recent-table">
            <thead>
              <tr>
                <th>Session</th>
                <th>Vehicle</th>
                <th>Track</th>
                <th>Last Opened</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>AMP Tire Test</td>
                <td>SDM26</td>
                <td>Arizona Motorsports Park</td>
                <td>Today</td>
              </tr>
              <tr>
                <td>Skidpad Practice</td>
                <td>SDM26</td>
                <td>Wild Horse Pass</td>
                <td>Yesterday</td>
              </tr>
              <tr>
                <td>Wet Test</td>
                <td>SDM26</td>
                <td>Podium Club</td>
                <td>Last Week</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
