import { usePerformance } from "../../../hooks/usePerformance";

export default function EngineerPanel() {

  const {
    performance,
    update,
  } = usePerformance();

  if (!performance) return null;

  function change(
    key: keyof typeof performance,
    value: string
  ) {

    const copy = structuredClone(performance);

    copy[key] = value as never;

    update(copy);

  }

  return (

    <div className="general-column">

      <h2>ENGINEER</h2>

      <div className="field">

        <label>Engineer Notes</label>

        <textarea

          rows={6}

          value={performance.engineerNotes}

          onChange={(e)=>

            change(

              "engineerNotes",

              e.target.value

            )

          }

        />

      </div>

      <div className="field">

        <label>Recommendations</label>

        <textarea

          rows={6}

          value={performance.recommendations}

          onChange={(e)=>

            change(

              "recommendations",

              e.target.value

            )

          }

        />

      </div>

      <div className="field">

        <label>Action Items</label>

        <textarea

          rows={6}

          value={performance.actionItems}

          onChange={(e)=>

            change(

              "actionItems",

              e.target.value

            )

          }

        />

      </div>

    </div>

  );

}
