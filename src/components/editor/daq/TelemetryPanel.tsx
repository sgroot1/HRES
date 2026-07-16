import { useDAQ } from "../../../hooks/useDAQ";

export default function TelemetryPanel() {

  const { daq, update } = useDAQ();

  if (!daq) return null;

  return (

    <div className="general-column">

      <h2>TELEMETRY</h2>

      <div className="field">

        <label>Telemetry File</label>

        <input
          value={daq.telemetryFile}
          onChange={(e) => {

            const copy = structuredClone(daq);

            copy.telemetryFile = e.target.value;

            update(copy);

          }}
        />

      </div>

      <div className="field">

        <label>CAN Log</label>

        <input
          value={daq.canLog}
          onChange={(e) => {

            const copy = structuredClone(daq);

            copy.canLog = e.target.value;

            update(copy);

          }}
        />

      </div>

      <div className="field">

        <label>Download Folder</label>

        <input
          value={daq.downloadFolder}
          onChange={(e) => {

            const copy = structuredClone(daq);

            copy.downloadFolder = e.target.value;

            update(copy);

          }}
        />

      </div>

    </div>

  );

}
