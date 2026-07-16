import { useRuns } from "../../../hooks/useRuns";
import RunCard from "./RunCard";

export default function RunList() {

  const {
    runs,
    openRun,
  } = useRuns();

  return (

    <div className="runs-table">

      <div className="runs-table-header">

        <div>Run</div>

        <div>Driver</div>

        <div>Status</div>

        <div>Best Lap</div>

      </div>

      {runs.length === 0 && (

        <div className="runs-empty">
          No runs yet.
        </div>

      )}

      {runs.map(run => (

        <RunCard

          key={run.id}

          run={run}

          onOpen={() =>
            openRun(run.id)
          }

        />

      ))}

    </div>

  );

}
