import { getCarProfile } from "../../../data/carProfiles";
import { useCatalogStore } from "../../../data/catalog";
import { useDAQ } from "../../../hooks/useDAQ";

export default function SensorPanel() {
  const { daq, update } = useDAQ();
  const selectedCarId = useCatalogStore((state) => state.selectedCarId);
  const profile = getCarProfile(selectedCarId);

  if (!daq) return null;

  function getSensorValue(key: string) {
    const current = daq as Record<string, unknown>;
    if (key in current && typeof current[key] === "boolean") {
      return Boolean(current[key]);
    }
    return Boolean(daq.customSensors?.[key]);
  }

  function updateSensor(key: string, value: boolean) {
    const current = daq as Record<string, unknown>;
    if (key in current && typeof current[key] === "boolean") {
      update({ [key]: value } as any);
      return;
    }

    update({
      customSensors: {
        ...daq.customSensors,
        [key]: value,
      },
    } as any);
  }

  return (
    <div className={profile.compactDaq ? "general-column sensor-stack sensor-stack-compact" : "general-column sensor-stack"}>
      <h2>SENSORS</h2>

      {profile.sensorGroups.map((group) => (
        <section className="sensor-group" key={group.title}>
          <div className="sensor-group-header">
            <strong>{group.title}</strong>
            <p>{group.description}</p>
          </div>

          <div className={profile.compactDaq ? "sensor-group-grid sensor-group-grid-compact" : "sensor-group-grid"}>
            {group.sensors.map((sensor) => (
              <div className="field compact-field" key={sensor.key}>
                <label>{sensor.label}</label>
                <select value={getSensorValue(sensor.key) ? "on" : "off"} onChange={(e) => updateSensor(sensor.key, e.target.value === "on") }>
                  <option value="off">Off</option>
                  <option value="on">On</option>
                </select>
                {sensor.helper && <small className="sensor-helper">{sensor.helper}</small>}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
