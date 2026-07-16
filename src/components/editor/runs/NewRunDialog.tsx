import { useState } from "react";

import Dialog from "../../ui/Dialog";

import { useRuns } from "../../../hooks/useRuns";
import { useSetupStore } from "../../../store/setupStore";

interface Props {

  open: boolean;

  onClose(): void;

}

export default function NewRunDialog({

  open,

  onClose,

}: Props) {

  const setup =
    useSetupStore(
      state => state.currentSetup
    );

  const {
    createRun,
  } = useRuns();

  const [driver, setDriver] =
    useState("");

  if (!setup) return null;

  return (

    <Dialog

      open={open}

      title="New Run"

      onClose={onClose}

    >

      <div className="field">

        <label>Driver</label>

        <input

          value={driver}

          onChange={e =>

            setDriver(
              e.target.value
            )

          }

        />

      </div>

      <button

        onClick={() => {

          createRun(

            setup.id,

            driver,

            String(
              setup.general.track ?? ""
            )

          );

          onClose();

        }}

      >

        Create Run

      </button>

    </Dialog>

  );

}
