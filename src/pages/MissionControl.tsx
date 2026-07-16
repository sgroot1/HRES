import CurrentSessionCard from "../components/home/CurrentSessionCard";
import EngineeringHealth from "../components/home/EngineeringHealth";
import CurrentActivityCard from "../components/home/CurrentActivityCard";
import ModuleCard from "../components/home/ModuleCard";

import { useNavigate } from "react-router-dom";
import TopNav from "../components/layout/TopNav";

export default function MissionControl() {

  const navigate = useNavigate();

  return (

    <div className="mission-control">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mission-shell">
        <TopNav />
      </div>

      {/* ======================================================
          CURRENT SESSION
      ====================================================== */}

      <CurrentSessionCard />

      {/* ======================================================
          ENGINEERING HEALTH
      ====================================================== */}

      <EngineeringHealth />

      {/* ======================================================
          ACTIVITY
      ====================================================== */}

      <CurrentActivityCard />

      {/* ======================================================
          RECENT SESSIONS
      ====================================================== */}

      <section className="recent-section">

        <div className="section-header">

          <h2>

            RECENT SESSIONS

          </h2>

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
