import { usePerformance } from "../../../hooks/usePerformance";
import { useRuns } from "../../../hooks/useRuns";

export default function AnalysisPanel() {

  const { performance } = usePerformance();

  const { currentRun } = useRuns();

  if (!performance) return null;

  const ratings = [

    performance.entryBalance,

    performance.midCornerBalance,

    performance.exitBalance,

    performance.brakingStability,

    performance.traction,

    performance.confidence,

  ].filter(
    (value): value is number =>
      value !== null
  );

  const overall = ratings.length
    ? (
        ratings.reduce(
          (a, b) => a + b,
          0
        ) / ratings.length
      ).toFixed(1)
    : "--";

  return (

    <div className="general-column">

      <h2>SUMMARY</h2>

      <div className="field">

        <label>Overall Driver Rating</label>

        <input

          readOnly

          value={overall}

        />

      </div>

      <div className="field">

        <label>Best Lap</label>

        <input

          readOnly

          value={
            currentRun?.bestLap ?? "--"
          }

        />

      </div>

      <div className="field">

        <label>Average Lap</label>

        <input

          readOnly

          value={
            currentRun?.averageLap ?? "--"
          }

        />

      </div>

      <div className="field">

        <label>Weather</label>

        <input

          readOnly

          value={
            currentRun?.weather ?? "--"
          }

        />

      </div>

      <div className="field">

        <label>Telemetry</label>

        <input

          readOnly

          value={
            currentRun?.telemetryFile
              ? "Attached"
              : "None"
          }

        />

      </div>

      <div className="field">

        <label>Status</label>

        <input

          readOnly

          value={
            currentRun?.status ?? "--"
          }

        />

      </div>

    </div>

  );

}
