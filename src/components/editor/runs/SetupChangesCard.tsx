import { useMemo } from "react";

import { useSetupStore } from "../../../store/setupStore";

import {
  compareSetups,
} from "../../../analytics";

export default function SetupChangesCard() {

  const setups = useSetupStore(
    state => state.setups
  );

  const currentSetup = useSetupStore(
    state => state.currentSetup
  );

  const previousSetup = useMemo(() => {

    if (!currentSetup) return null;

    return setups.find(
      s => s.id === currentSetup.parentId
    ) ?? null;

  }, [setups, currentSetup]);

  const changes = compareSetups(
    previousSetup,
    currentSetup
  );

  return (

    <div className="general-column">

      <h2>SETUP CHANGES</h2>

      {!changes.length && (

        <p>

          No setup changes detected.

        </p>

      )}

      {changes.map(change => (

        <div
          key={`${change.section}-${change.field}`}
          className="change-row"
        >

          <div>

            <strong>

              {change.field}

            </strong>

            <small>

              {change.section}

            </small>

          </div>

          <div className="change-values">

            <span>

              {change.previous}

            </span>

            <span>

              →

            </span>

            <strong>

              {change.current}

            </strong>

          </div>

        </div>

      ))}

    </div>

  );

}
