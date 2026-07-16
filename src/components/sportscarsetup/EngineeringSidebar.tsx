import { useRunStore } from "../../store/runStore";
import { useSetupStore } from "../../store/setupStore";
import { useSessionStore } from "../../store/sessionStore";

import {
  getDriverRating,
  getDriverGrade,
  getBestLap,
  getAverageLap,
  telemetryAvailable,
  getRecommendation,
} from "../../analytics";

export default function EngineeringSidebar() {

  const session = useSessionStore(
    (state) => state.session
  );

  const setup = useSetupStore(
    (state) => state.currentSetup
  );

  const run = useRunStore(
    (state) => state.currentRun
  );

  const rating =
    setup?.performance
      ? getDriverRating(setup.performance)
      : null;

  const grade =
    getDriverGrade(rating);

  const recommendation =
    getRecommendation();

  return (

    <aside className="engineering-sidebar">

      <div className="sidebar-section">

        <h2>CURRENT SESSION</h2>

        <div className="info-grid">

          <span>Session</span>
          <strong>{session?.name ?? "--"}</strong>

          <span>Vehicle</span>
          <strong>{session?.vehicle ?? "--"}</strong>

          <span>Driver</span>
          <strong>{run?.driver ?? "--"}</strong>

          <span>Track</span>
          <strong>{run?.track ?? "--"}</strong>

          <span>Setup</span>
          <strong>{setup?.name ?? "--"}</strong>

          <span>Status</span>
          <strong>{setup?.status ?? "--"}</strong>

          <span>Run</span>
          <strong>
            {run ? `#${run.number}` : "--"}
          </strong>

        </div>

      </div>

      <div className="sidebar-section">

        <h2>LIVE PERFORMANCE</h2>

        <div className="kpi-card">

          <label>BEST LAP</label>

          <strong>

            {getBestLap(run)}

          </strong>

        </div>

        <div className="kpi-card">

          <label>AVERAGE LAP</label>

          <strong>

            {getAverageLap(run)}

          </strong>

        </div>

        <div className="kpi-card">

          <label>DRIVER RATING</label>

          <strong>

            {rating ?? "--"}

          </strong>

          <small>

            {grade}

          </small>

        </div>

      </div>

      <div className="sidebar-section">

        <h2>RUN STATUS</h2>

        <div className="info-grid">

          <span>Weather</span>
          <strong>
            {run?.weather ?? "--"}
          </strong>

          <span>Telemetry</span>
          <strong>
            {telemetryAvailable(run)
              ? "Attached"
              : "None"}
          </strong>

          <span>Status</span>
          <strong>
            {run?.status ?? "--"}
          </strong>

        </div>

      </div>

      <div className="sidebar-section">

        <h2>ENGINEERING</h2>

        <div className="recommendation-card">

          <strong>

            {recommendation.title}

          </strong>

          <div
            style={{
              marginTop: 12,
              color: "#9097A0",
              fontSize: "12px",
            }}
          >

            Confidence: {recommendation.confidence}%

          </div>

        </div>

      </div>

    </aside>

  );

}
