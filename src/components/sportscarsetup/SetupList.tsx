import { useMemo, useState } from "react";
import { useSetupStore } from "../../store/setupStore";

export default function SetupList() {
  const setups = useSetupStore((s) => s.setups);
  const currentSetup = useSetupStore((s) => s.currentSetup);
  const openSetup = useSetupStore((s) => s.openSetup);

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {

    return setups.filter((setup) =>
      setup.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [search, setups]);

  return (

    <aside className="setup-explorer">

      <div className="setup-header">

        <h2>SETUPS</h2>

        <input
          className="setup-search"
          placeholder="Search setups..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      <div className="setup-items">

        {filtered.length === 0 && (

          <div className="setup-empty">

            No setups found

          </div>

        )}

        {filtered.map((setup) => (

          <button

            key={setup.id}

            onClick={() => openSetup(setup.id)}

            className={
              currentSetup?.id === setup.id
                ? "setup-card active"
                : "setup-card"
            }

          >

            <div className="setup-top">

              <div>

                <div className="setup-name">

                  {setup.name}

                </div>

                <div className="setup-version">

                  Version {setup.version}

                </div>

              </div>

              <div className="setup-status">

                {setup.status}

              </div>

            </div>

            <div className="setup-bottom">

              <span>

                Updated

              </span>

              <span>

                {new Date(
                  setup.updatedAt
                ).toLocaleDateString()}

              </span>

            </div>

          </button>

        ))}

      </div>

    </aside>

  );

}
