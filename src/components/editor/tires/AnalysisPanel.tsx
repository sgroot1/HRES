import { useTires } from "../../../hooks/useTires";

import {
  calculatePressureGain,
  calculateAverageTemperature,
  calculateTemperatureSpread,
} from "../../../calculations/tires";

export default function AnalysisPanel() {

  const { tires } = useTires();

  if (!tires) return null;

  return (

    <div className="general-column">

      <h2>ANALYSIS</h2>

      <table className="analysis-table">

        <thead>

          <tr>

            <th></th>

            <th>LF</th>

            <th>RF</th>

            <th>LR</th>

            <th>RR</th>

          </tr>

        </thead>

        <tbody>

          <tr>

            <td>Pressure Gain</td>

            <td>{calculatePressureGain(tires.lf.coldPressure, tires.lf.hotPressure) ?? "--"}</td>

            <td>{calculatePressureGain(tires.rf.coldPressure, tires.rf.hotPressure) ?? "--"}</td>

            <td>{calculatePressureGain(tires.lr.coldPressure, tires.lr.hotPressure) ?? "--"}</td>

            <td>{calculatePressureGain(tires.rr.coldPressure, tires.rr.hotPressure) ?? "--"}</td>

          </tr>

          <tr>

            <td>Average Temp</td>

            <td>{calculateAverageTemperature(tires.lf) ?? "--"}</td>

            <td>{calculateAverageTemperature(tires.rf) ?? "--"}</td>

            <td>{calculateAverageTemperature(tires.lr) ?? "--"}</td>

            <td>{calculateAverageTemperature(tires.rr) ?? "--"}</td>

          </tr>

          <tr>

            <td>Temp Spread</td>

            <td>{calculateTemperatureSpread(tires.lf) ?? "--"}</td>

            <td>{calculateTemperatureSpread(tires.rf) ?? "--"}</td>

            <td>{calculateTemperatureSpread(tires.lr) ?? "--"}</td>

            <td>{calculateTemperatureSpread(tires.rr) ?? "--"}</td>

          </tr>

        </tbody>

      </table>

      <div className="field">

        <label>Notes</label>

        <textarea
          rows={8}
          placeholder="Tire observations..."
        />

      </div>

    </div>

  );

}
