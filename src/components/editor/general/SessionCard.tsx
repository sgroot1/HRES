import { useCatalogStore } from "../../../data/catalog";
import { useSetupStore } from "../../../store/setupStore";

export default function SessionCard() {
  const setup = useSetupStore((s) => s.currentSetup);
  const update = useSetupStore((s) => s.updateGeneral);
  const selectedCarId = useCatalogStore((state) => state.selectedCarId);
  const tracks = useCatalogStore((state) => state.tracks);
  const drivers = useCatalogStore((state) => state.drivers);

  if (!setup) return null;

  const general = setup.general;

  return (
    <div className="general-column">
      <h2>SESSION</h2>

      <div className="field">
        <label>Track</label>
        <select
          value={String(general.track ?? "")}
          onChange={(e) => update({ track: e.target.value, event: general.event || "Test Session" })}
        >
          <option value="">Select Track</option>
          {tracks.map((track) => (
            <option key={track.id} value={track.name}>
              {track.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Driver</label>
        <select value={String(general.driver ?? "")} onChange={(e) => update({ driver: e.target.value })}>
          <option value="">Select Driver</option>
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.name}>
              {driver.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Engineer</label>
        <input value={String(general.engineer ?? "")} onChange={(e) => update({ engineer: e.target.value })} />
      </div>

      <div className="field">
        <label>Car Context</label>
        <input readOnly value={selectedCarId.toUpperCase()} />
      </div>
    </div>
  );
}
