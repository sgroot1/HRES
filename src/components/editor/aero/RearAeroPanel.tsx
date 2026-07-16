import { useAero } from "../../../hooks/useAero";

export default function RearAeroPanel() {

  const { aero, update } = useAero();

  if (!aero) return null;

  return (

    <div className="general-column">

      <h2>REAR AERO</h2>

      <div className="field">

        <label>Rear Wing</label>

        <input

          type="number"

          value={aero.rearWing ?? ""}

          onChange={(e)=>{

            const copy = structuredClone(aero);

            copy.rearWing = Number(e.target.value);

            update(copy);

          }}

        />

      </div>

      <div className="field">

        <label>Diffuser</label>

        <input

          type="number"

          value={aero.diffuser ?? ""}

          onChange={(e)=>{

            const copy = structuredClone(aero);

            copy.diffuser = Number(e.target.value);

            update(copy);

          }}

        />

      </div>

      <div className="field">

        <label>Gurney</label>

        <select

          value={aero.gurney ? "on" : "off"}

          onChange={(e)=>{

            const copy = structuredClone(aero);

            copy.gurney = e.target.value === "on";

            update(copy);

          }}

        >

          <option value="off">Off</option>
          <option value="on">On</option>

        </select>

      </div>

      <div className="field">

        <label>Rear RH Target</label>

        <input

          type="number"

          value={aero.rearRideHeightTarget ?? ""}

          onChange={(e)=>{

            const copy = structuredClone(aero);

            copy.rearRideHeightTarget = Number(e.target.value);

            update(copy);

          }}

        />

      </div>

    </div>

  );

}
