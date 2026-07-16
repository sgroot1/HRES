import { Run } from "../../../types/run";

interface Props {
  run: Run;
  onOpen(): void;
}

export default function RunCard({
  run,
  onOpen,
}: Props) {
  return (
    <div
      className="runs-row"
      onClick={onOpen}
    >
      <div>
        <strong>Run {run.number}</strong>
      </div>

      <div>{run.driver}</div>

      <div>{run.status}</div>

      <div>
        {run.bestLap == null
          ? "--"
          : `${run.bestLap.toFixed(3)} s`}
      </div>
    </div>
  );
}
