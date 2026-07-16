import BrakeSystemPanel from "./BrakeSystemPanel";
import BrakeBiasPanel from "./BrakeBiasPanel";
import BrakeNotesPanel from "./BrakeNotesPanel";

export default function BrakeSection() {
  return (
    <div className="general-grid">
      <BrakeSystemPanel />
      <BrakeBiasPanel />
      <BrakeNotesPanel />
    </div>
  );
}
