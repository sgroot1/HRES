import { useRunStore } from "../../../store/runStore";
import {
  getDriverRating,
  getDriverGrade,
} from "../../../analytics";

export default function RunSummaryCard() {

  const run = useRunStore(
    (state) => state.currentRun
  );

  if (!run) {

    return (

      <div className="general-column">

        <h2>RUN SUMMARY</h2>

        <p>No run selected.</p>

      </div>

    );

  }

  const rating = run.performance
    ? getDriverRating(run.performance)
    : null;

  const grade =
    getDriverGrade(rating);

  return (

    <div className="general-column">

      <h2>RUN SUMMARY</h2>

      <div className="summary-grid">

        <div className="summary-row">
          <span>Run</span>
          <strong>#{run.number}</strong>
        </div>

        <div className="summary-row">
          <span>Driver</span>
          <strong>{run.driver}</strong>
        </div>

        <div className="summary-row">
          <span>Track</span>
          <strong>{run.track}</strong>
        </div>

        <div className="summary-row">
          <span>Status</span>
          <strong>{run.status}</strong>
        </div>

        <div className="summary-row">
          <span>Best Lap</span>
          <strong>

            {run.bestLap
              ? run.bestLap.toFixed(3)
              : "--"}

          </strong>
        </div>

        <div className="summary-row">
          <span>Average Lap</span>
          <strong>

            {run.averageLap
              ? run.averageLap.toFixed(3)
              : "--"}

          </strong>
        </div>

      </div>

      <hr />

      <div className="summary-grid">

        <div className="summary-row">

          <span>Driver Rating</span>

          <strong>

            {rating ?? "--"}

          </strong>

        </div>

        <div className="summary-row">

          <span>Evaluation</span>

          <strong>

            {grade}

          </strong>

        </div>

      </div>

      <hr />

      <h3>Driver Notes</h3>

      <div className="summary-notes">

        {run.driverNotes || "No driver notes."}

      </div>

      <h3>Engineer Notes</h3>

      <div className="summary-notes">

        {run.engineerNotes || "No engineer notes."}

      </div>

    </div>

  );

}
