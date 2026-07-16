import { useBrakes } from "../../../hooks/useBrakes";

export default function BrakeBiasPanel() {

  const { brakes, update } = useBrakes();

  if (!brakes) return null;

  return (

    <div className="general-column">

      <h2>BRAKE BIAS</h2>

      <div className="field">
        <label>Front Bias (%)</label>
        <input
          type="number"
          value={brakes.frontBias ?? ""}
          onChange={(e) => {

            const copy = structuredClone(brakes);

            copy.frontBias = Number(e.target.value);

            update(copy);

          }}
        />
      </div>

      <div className="field">
        <label>Rear Bias (%)</label>
        <input
          type="number"
          value={brakes.rearBias ?? ""}
          onChange={(e) => {

            const copy = structuredClone(brakes);

            copy.rearBias = Number(e.target.value);

            update(copy);

          }}
        />
      </div>

      <div className="field">
        <label>Master Cylinder</label>
        <input
          value={brakes.masterCylinder}
          onChange={(e) => {

            const copy = structuredClone(brakes);

            copy.masterCylinder = e.target.value;

            update(copy);

          }}
        />
      </div>

      <div className="field">
        <label>Pedal Ratio</label>
        <input
          type="number"
          value={brakes.pedalRatio ?? ""}
          onChange={(e) => {

            const copy = structuredClone(brakes);

            copy.pedalRatio = Number(e.target.value);

            update(copy);

          }}
        />
      </div>

    </div>

  );

}
