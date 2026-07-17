import { getCarProfile } from "../../../data/carProfiles";
import { useCatalogStore } from "../../../data/catalog";
import { useSetupStore } from "../../../store/setupStore";

export default function SetupInfoCard() {
  const setup = useSetupStore((state) => state.currentSetup);
  const selectedCarId = useCatalogStore((state) => state.selectedCarId);
  const profile = getCarProfile(selectedCarId);

  if (!setup) {
    return (
      <div className="general-column">
        <h2>SETUP INFORMATION</h2>
        <p>No setup selected.</p>
      </div>
    );
  }

  const general = setup.general;

  return (
    <div className="general-column">
      <h2>SETUP INFORMATION</h2>
      <div className="general-info-grid">
        <div className="field compact-field">
          <label>Setup Name</label>
          <input readOnly value={general.setupName ?? ""} />
        </div>

        <div className="field compact-field">
          <label>Vehicle</label>
          <input readOnly value={general.vehicle ?? profile.displayName} />
        </div>

        <div className="field compact-field">
          <label>Package</label>
          <input readOnly value={profile.setupLayout === "gt4" ? "GT4 endurance" : "Autocross / standard"} />
        </div>

        <div className="field compact-field">
          <label>Version</label>
          <input readOnly value={`v${setup.version}`} />
        </div>

        <div className="field compact-field">
          <label>Status</label>
          <input readOnly value={setup.status} />
        </div>

        <div className="field compact-field">
          <label>Driver</label>
          <input readOnly value={general.driver ?? ""} />
        </div>

        <div className="field compact-field">
          <label>Engineer</label>
          <input readOnly value={general.engineer ?? ""} />
        </div>

        <div className="field compact-field">
          <label>Track</label>
          <input readOnly value={general.track ?? ""} />
        </div>

        <div className="field compact-field">
          <label>Event</label>
          <input readOnly value={general.event ?? ""} />
        </div>

        <div className="field compact-field">
          <label>Created</label>
          <input readOnly value={new Date(setup.createdAt).toLocaleString()} />
        </div>

        <div className="field compact-field">
          <label>Last Modified</label>
          <input readOnly value={new Date(setup.updatedAt).toLocaleString()} />
        </div>
      </div>
    </div>
  );
}
