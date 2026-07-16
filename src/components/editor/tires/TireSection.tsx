import PressurePanel from "./PressurePanel";
import TemperaturePanel from "./TemperaturePanel";
import AnalysisPanel from "./AnalysisPanel";

export default function TireSection() {

  return (

    <div className="general-grid">

      <PressurePanel />

      <TemperaturePanel />

      <WearPanel />

    </div>

  );

}
