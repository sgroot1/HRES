import { useBrakes } from "../../../hooks/useBrakes";

export default function BrakeNotesPanel() {

  const { brakes, update } = useBrakes();

  if (!brakes) return null;

  return (

    <div className="general-column">

      <h2>NOTES</h2>

      <textarea
        rows={12}
        value={brakes.notes}
        onChange={(e) => {

          const copy = structuredClone(brakes);

          copy.notes = e.target.value;

          update(copy);

        }}
      />

    </div>

  );

}
