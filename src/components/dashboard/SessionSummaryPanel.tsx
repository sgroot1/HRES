import { useRunStore } from "../../store/runStore";

export default function SessionSummaryPanel() {

  const run = useRunStore(
    s => s.currentRun
  );

  return (

    <section className="dashboard-panel">

      <h2>SESSION</h2>

      <div className="dashboard-row">

        <span>Driver</span>

        <strong>{run?.driver ?? "--"}</strong>

      </div>

      <div className="dashboard-row">

        <span>Track</span>

        <strong>{run?.track ?? "--"}</strong>

      </div>

      <div className="dashboard-row">

        <span>Weather</span>

        <strong>{run?.weather ?? "--"}</strong>

      </div>

      <div className="dashboard-row">

        <span>Best Lap</span>

        <strong>

          {run?.bestLap ?? "--"}

        </strong>

      </div>

    </section>

  );

}
