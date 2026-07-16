import { useDrivetrain } from "../../../hooks/useDrivetrain";

export default function DiffNotesPanel() {
  const { drivetrain, update } = useDrivetrain();

  if (!drivetrain) return null;

  return (
    <div className="general-column">
      <h2>DIFF NOTES</h2>

      <div className="field">
        <label>Driver Feedback</label>
        <textarea
          value={drivetrain.notes ?? ""}
          onChange={(event) => update({ notes: event.target.value })}
          placeholder="Stability on entry, throttle pickup, and lock behavior."
        />
      </div>
    </div>
  );
}
