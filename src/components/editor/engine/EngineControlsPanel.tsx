import { useEngine } from "../../../hooks/useEngine";

export default function EngineControlsPanel() {

  const {
    engine,
    update,
  } = useEngine();

  if (!engine) return null;

  return (

    <div className="general-column">

      <h2>ENGINE</h2>

      <div className="field">

        <label>Throttle Map</label>

        <select
          value={engine.throttleMap}
          onChange={(e) => {

            const copy = structuredClone(engine);

            copy.throttleMap = e.target.value;

            update(copy);

          }}
        >

          <option value="Map 1">Map 1</option>
          <option value="Map 2">Map 2</option>
          <option value="Map 3">Map 3</option>

        </select>

      </div>

      <div className="field">

        <label>Fuel Map</label>

        <select
          value={engine.fuelMap}
          onChange={(e) => {

            const copy = structuredClone(engine);

            copy.fuelMap = e.target.value;

            update(copy);

          }}
        >

          <option value="Lean">Lean</option>
          <option value="Normal">Normal</option>
          <option value="Rich">Rich</option>

        </select>

      </div>

      <div className="field">

        <label>Rev Limit</label>

        <input
          type="number"
          value={engine.revLimit ?? ""}
          onChange={(e) => {

            const copy = structuredClone(engine);

            copy.revLimit = Number(e.target.value);

            update(copy);

          }}
        />

      </div>

      <div className="field">

        <label>Engine Brake</label>

        <input
          type="number"
          value={engine.engineBrake ?? ""}
          onChange={(e) => {

            const copy = structuredClone(engine);

            copy.engineBrake = Number(e.target.value);

            update(copy);

          }}
        />

      </div>

    </div>

  );

}
