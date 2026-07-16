import { useDAQ } from "../../../hooks/useDAQ";

export default function DaqNotesPanel() {

  const { daq, update } = useDAQ();

  if (!daq) return null;

  return (

    <div className="general-column">

      <h2>NOTES</h2>

      <textarea

        rows={14}

        value={daq.notes}

        onChange={(e)=>{

          const copy = structuredClone(daq);

          copy.notes = e.target.value;

          update(copy);

        }}

      />

    </div>

  );

}
