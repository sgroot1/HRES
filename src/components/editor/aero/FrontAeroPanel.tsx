import { useAero } from "../../../hooks/useAero";

export default function FrontAeroPanel() {

  const { aero, update } = useAero();

  if (!aero) return null;

  return (

    <div className="general-column">

      <h2>FRONT AERO</h2>

      <div className="field">

        <label>Front Wing</label>

        <input

          type="number"

          value={aero.frontWing ?? ""}

          onChange={(e)=>{

            const copy = structuredClone(aero);

            copy.frontWing = Number(e.target.value);

            update(copy);

          }}

        />

      </div>

      <div className="field">

        <label>Dive Planes</label>

        <input

          type="number"

          value={aero.divePlanes ?? ""}

          onChange={(e)=>{

            const copy = structuredClone(aero);

            copy.divePlanes = Number(e.target.value);

            update(copy);

          }}

        />

      </div>

      <div className="field">

        <label>Splitter</label>

        <input

          type="number"

          value={aero.splitter ?? ""}

          onChange={(e)=>{

            const copy = structuredClone(aero);

            copy.splitter = Number(e.target.value);

            update(copy);

          }}

        />

      </div>

      <div className="field">

        <label>Front RH Target</label>

        <input

          type="number"

          value={aero.frontRideHeightTarget ?? ""}

          onChange={(e)=>{

            const copy = structuredClone(aero);

            copy.frontRideHeightTarget = Number(e.target.value);

            update(copy);

          }}

        />

      </div>

    </div>

  );

}
