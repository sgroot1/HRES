import { usePerformance } from "../../hooks/usePerformance";

export default function DriverSummaryPanel() {

  const { performance } = usePerformance();

  if (!performance) return null;

  const ratings = [

    performance.entryBalance,
    performance.midCornerBalance,
    performance.exitBalance,
    performance.brakingStability,
    performance.traction,
    performance.confidence,

  ].filter(
    (v): v is number => v !== null
  );

  const average = ratings.length
    ? (
        ratings.reduce((a, b) => a + b, 0) /
        ratings.length
      ).toFixed(1)
    : "--";

  return (

    <section className="dashboard-panel">

      <h2>DRIVER</h2>

      <div className="dashboard-kpi">

        <label>Overall Rating</label>

        <strong>{average}</strong>

      </div>

      <div className="dashboard-text">

        {performance.driverComments || "No driver comments."}

      </div>

    </section>

  );

}
