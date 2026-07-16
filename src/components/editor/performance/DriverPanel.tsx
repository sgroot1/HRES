import { usePerformance } from "../../../hooks/usePerformance";

export default function DriverPanel() {

  const {
    performance,
    update,
  } = usePerformance();

  if (!performance) return null;

  function change(
    key: keyof typeof performance,
    value: number | string
  ) {

    const copy = structuredClone(performance);

    (copy as any)[key] = value;

    update(copy);

  }

  return (

    <div className="general-column">

      <h2>DRIVER</h2>

      {[
        ["Entry Balance", "entryBalance"],
        ["Mid Corner", "midCornerBalance"],
        ["Exit Balance", "exitBalance"],
        ["Braking Stability", "brakingStability"],
        ["Traction", "traction"],
        ["Confidence", "confidence"],
      ].map(([label, key]) => (

        <div className="field" key={key}>

          <label>{label}</label>

          <input
            type="number"
            min={1}
            max={10}
            value={(performance as any)[key] ?? ""}
            onChange={(e) =>
              change(
                key as keyof typeof performance,
                Number(e.target.value)
              )
            }
          />

        </div>

      ))}

      <div className="field">

        <label>Driver Comments</label>

        <textarea
          rows={6}
          value={performance.driverComments}
          onChange={(e) =>
            change(
              "driverComments",
              e.target.value
            )
          }
        />

      </div>

    </div>

  );

}
