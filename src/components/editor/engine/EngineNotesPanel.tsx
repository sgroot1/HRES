import { useEngine } from "../../../hooks/useEngine";

export default function EngineNotesPanel() {

  const {
    engine,
    update,
  } = useEngine();

  if (!engine) return null;

  return (

    <div className="general-column">

      <h2>NOTES</h2>

      <div className="field">

        <label>Engineer Notes</label>

        <textarea

          rows={14}

          value={engine.notes}

          onChange={(e)=>{

            const copy = structuredClone(engine);

            copy.notes = e.target.value;

            update(copy);

          }}

        />

      </div>

    </div>

  );

}
