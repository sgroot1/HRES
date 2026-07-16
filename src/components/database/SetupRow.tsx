import { Setup } from "../../types/setup";

interface Props {

  setup: Setup;

  onOpen(): void;

  onDuplicate(): void;

  onDelete(): void;

}

export default function SetupRow({

  setup,

  onOpen,
    const updatedDate = new Date(setup.updatedAt).toLocaleDateString();
    const weather = setup.general.weather || "Autocross";
    const track = setup.general.track || "Track not set";

    return (
      <div className="setup-card-row">
        <div className="setup-card-head">
          <span className="setup-card-version">V{setup.version}</span>
          <span className="setup-card-date">{updatedDate}</span>
        </div>

        <div className="setup-card-body">
          <h3>{setup.name}</h3>
          <p>{weather}</p>
          <p>{track}</p>
        </div>

        <div className="setup-card-actions">
          <button className="setup-card-edit" onClick={onOpen}>
            Edit Setup
          </button>

          <button className="setup-card-link" onClick={onDuplicate}>
            Duplicate
          </button>

          <button className="setup-card-link" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    );

      </div>

    </div>

  );

}
