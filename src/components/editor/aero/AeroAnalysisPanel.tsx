import { useAero } from "../../../hooks/useAero";

export default function AeroAnalysisPanel() {

  const { aero, update } = useAero();

  if (!aero) return null;

  const wingDifference =
    aero.frontWing != null &&
    aero.rearWing != null
      ? aero.rearWing - aero.frontWing
      : null;

  const rideHeightDifference =
    aero.frontRideHeightTarget != null &&
    aero.rearRideHeightTarget != null
      ? aero.rearRideHeightTarget -
        aero.frontRideHeightTarget
      : null;

  return (

    <div className="general-column">

      <h2>ANALYSIS</h2>

      <div className="field">

        <label>Wing Difference</label>

        <input

          readOnly

          value={
            wingDifference ?? "--"
          }

        />

      </div>

      <div className="field">

        <label>Ride Height Delta</label>

        <input

          readOnly

          value={
            rideHeightDifference ?? "--"
          }

        />

      </div>

      <div className="field">

        <label>Notes</label>

        <textarea

          rows={10}

          value={aero.notes}

          onChange={(e)=>{

            const copy =
              structuredClone(aero);

            copy.notes =
              e.target.value;

            update(copy);

          }}

        />

      </div>

    </div>

  );

}
