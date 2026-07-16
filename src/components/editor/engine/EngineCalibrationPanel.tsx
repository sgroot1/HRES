import { useEngine } from "../../../hooks/useEngine";

export default function EngineCalibrationPanel() {

  const {
    engine,
    update,
  } = useEngine();

  if (!engine) return null;

  return (

    <div className="general-column">

      <h2>CALIBRATION</h2>

      <div className="field">

        <label>Launch Control</label>

        <select
          value={engine.launchControl ? "on" : "off"}
          onChange={(e)=>{

            const copy = structuredClone(engine);

            copy.launchControl = e.target.value === "on";

            update(copy);

          }}
        >

          <option value="off">Off</option>
          <option value="on">On</option>

        </select>

      </div>

      <div className="field">

        <label>Traction Control</label>

        <select
          value={engine.tractionControl ? "on" : "off"}
          onChange={(e)=>{

            const copy = structuredClone(engine);

            copy.tractionControl = e.target.value === "on";

            update(copy);

          }}
        >

          <option value="off">Off</option>
          <option value="on">On</option>

        </select>

      </div>

      <div className="field">

        <label>Shift Light</label>

        <input
          type="number"
          value={engine.shiftLight ?? ""}
          onChange={(e)=>{

            const copy = structuredClone(engine);

            copy.shiftLight = Number(e.target.value);

            update(copy);

          }}
        />

      </div>

      <div className="field">

        <label>Pit Limiter</label>

        <select
          value={engine.pitLimiter ? "on" : "off"}
          onChange={(e)=>{

            const copy = structuredClone(engine);

            copy.pitLimiter = e.target.value === "on";

            update(copy);

          }}
        >

          <option value="off">Off</option>
          <option value="on">On</option>

        </select>

      </div>

    </div>

  );

}
