import { useSetupStore } from "../../../store/setupStore";

export default function SessionCard() {

  const setup =
    useSetupStore(
      s => s.currentSetup
    );

  const update =
    useSetupStore(
      s => s.updateGeneral
    );

  if (!setup) return null;

  const general = setup.general;

  return (

    <div className="general-column">

      <h2>SESSION</h2>

      <div className="field">

        <label>Track</label>

        <select

          value={String(general.track ?? "")}

          onChange={e=>

            update({

              track:e.target.value

            })

          }

        >

          <option>

            Arizona Motorsports Park

          </option>

          <option>

            Wild Horse Pass

          </option>

          <option>

            Podium Club

          </option>

          <option>

            Inde Motorsports Ranch

          </option>

        </select>

      </div>

      <div className="field">

        <label>Driver</label>

        <input

          value={String(general.driver ?? "")}

          onChange={e=>

            update({

              driver:e.target.value

            })

          }

        />

      </div>

      <div className="field">

        <label>Engineer</label>

        <input

          value={String(general.engineer ?? "")}

          onChange={e=>

            update({

              engineer:e.target.value

            })

          }

        />

      </div>

    </div>

  );

}
