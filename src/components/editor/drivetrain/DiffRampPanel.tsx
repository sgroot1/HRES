import { useDrivetrain } from "../../../hooks/useDrivetrain";

export default function DiffRampPanel() {
  const { drivetrain, update } = useDrivetrain();

  const toNullableNumber = (value: string): number | null => {
    if (value.trim() === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  if (!drivetrain) return null;

  return (
    <div className="general-column">
      <h2>RAMP & LOCK</h2>

      <div className="field">
        <label>Accel Ramp Angle (deg)</label>
        <input
          type="number"
          value={drivetrain.rampAngleAccelDeg ?? ""}
          onChange={(event) => update({ rampAngleAccelDeg: toNullableNumber(event.target.value) })}
        />
      </div>

      <div className="field">
        <label>Decel Ramp Angle (deg)</label>
        <input
          type="number"
          value={drivetrain.rampAngleDecelDeg ?? ""}
          onChange={(event) => update({ rampAngleDecelDeg: toNullableNumber(event.target.value) })}
        />
      </div>

      <div className="field">
        <label>Power Lock (%)</label>
        <input
          type="number"
          value={drivetrain.powerLockPercent ?? ""}
          onChange={(event) => update({ powerLockPercent: toNullableNumber(event.target.value) })}
        />
      </div>

      <div className="field">
        <label>Coast Lock (%)</label>
        <input
          type="number"
          value={drivetrain.coastLockPercent ?? ""}
          onChange={(event) => update({ coastLockPercent: toNullableNumber(event.target.value) })}
        />
      </div>
    </div>
  );
}
