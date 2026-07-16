import { useDrivetrain } from "../../../hooks/useDrivetrain";

export default function DiffCorePanel() {
  const { drivetrain, update } = useDrivetrain();

  const toNullableNumber = (value: string): number | null => {
    if (value.trim() === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  if (!drivetrain) return null;

  return (
    <div className="general-column">
      <h2>DIFFERENTIAL CORE</h2>

      <div className="field">
        <label>Differential Mode</label>
        <select
          value={drivetrain.differentialMode ?? "Open"}
          onChange={(event) => update({ differentialMode: event.target.value })}
        >
          <option value="Open">Open</option>
          <option value="Clutch LSD">Clutch LSD</option>
          <option value="Helical LSD">Helical LSD</option>
          <option value="Locked">Locked</option>
        </select>
      </div>

      <div className="field">
        <label>Preload (Nm)</label>
        <input
          type="number"
          value={drivetrain.preloadNm ?? ""}
          onChange={(event) => update({ preloadNm: toNullableNumber(event.target.value) })}
        />
      </div>

      <div className="field">
        <label>Final Drive Ratio</label>
        <input
          type="number"
          step="0.01"
          value={drivetrain.finalDriveRatio ?? ""}
          onChange={(event) => update({ finalDriveRatio: toNullableNumber(event.target.value) })}
        />
      </div>

      <div className="field">
        <label>Chain Tension (mm)</label>
        <input
          type="number"
          value={drivetrain.chainTensionMm ?? ""}
          onChange={(event) => update({ chainTensionMm: toNullableNumber(event.target.value) })}
        />
      </div>
    </div>
  );
}
