import { useDAQ } from "../../../hooks/useDAQ";

export default function SensorPanel() {

  const { daq, update } = useDAQ();

  if (!daq) return null;

  function updateSensor(
    sensor: keyof typeof daq,
    value: boolean
  ) {

    const copy = structuredClone(daq);

    copy[sensor] = value;

    update(copy);

  }

  return (

    <div className="general-column">

      <h2>SENSORS</h2>

      <div className="field">

        <label>Steering Angle</label>

        <select
          value={daq.steeringAngleSensor ? "on" : "off"}
          onChange={(e)=>

            updateSensor(
              "steeringAngleSensor",
              e.target.value === "on"
            )

          }
        >
          <option value="off">Off</option>
          <option value="on">On</option>
        </select>

      </div>

      <div className="field">

        <label>Throttle Position</label>

        <select
          value={daq.throttlePositionSensor ? "on" : "off"}
          onChange={(e)=>

            updateSensor(
              "throttlePositionSensor",
              e.target.value === "on"
            )

          }
        >
          <option value="off">Off</option>
          <option value="on">On</option>
        </select>

      </div>

      <div className="field">

        <label>Brake Pressure</label>

        <select
          value={daq.brakePressureSensor ? "on" : "off"}
          onChange={(e)=>

            updateSensor(
              "brakePressureSensor",
              e.target.value === "on"
            )

          }
        >
          <option value="off">Off</option>
          <option value="on">On</option>
        </select>

      </div>

      <div className="field">

        <label>Wheel Speed</label>

        <select
          value={daq.wheelSpeedSensor ? "on" : "off"}
          onChange={(e)=>

            updateSensor(
              "wheelSpeedSensor",
              e.target.value === "on"
            )

          }
        >
          <option value="off">Off</option>
          <option value="on">On</option>
        </select>

      </div>

      <div className="field">

        <label>GPS</label>

        <select
          value={daq.gpsSensor ? "on" : "off"}
          onChange={(e)=>

            updateSensor(
              "gpsSensor",
              e.target.value === "on"
            )

          }
        >
          <option value="off">Off</option>
          <option value="on">On</option>
        </select>

      </div>

    </div>

  );

}
