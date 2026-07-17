import { getCarProfile } from "../../data/carProfiles";
import { useCatalogStore } from "../../data/catalog";
import { useWorkspaceStore } from "../../context/workspace";
import { useSetupStore } from "../../store/setupStore";

import GeneralSection from "../editor/general/GeneralSection";
import SuspensionSection from "../editor/suspension/SuspensionSection";
import EngineSection from "../editor/engine/EngineSection";
import DaqSection from "../editor/daq/DaqSection";
import AeroSection from "../editor/aero/AeroSection";
import DrivetrainSection from "../editor/drivetrain/DrivetrainSection";

export default function WorkspaceTabs() {
  const setup = useSetupStore((state) => state.currentSetup);
  const page = useWorkspaceStore((state) => state.module);
  const setPage = useWorkspaceStore((state) => state.setModule);

  const selectedCarId = useCatalogStore((state) => state.selectedCarId);
  const profile = getCarProfile(selectedCarId);

  const availableTabs = profile.workspaceModules;
  const activeModule = availableTabs.includes(page) ? page : availableTabs[0] ?? "General";

  if (!setup) {
    return (
      <main className="workspace-center">
        <div className="workspace-empty">
          <h2>No Setup Selected</h2>
          <p>Select a setup from the Setup Explorer to begin editing.</p>
        </div>
      </main>
    );
  }

  function renderPage() {
    switch (activeModule) {
      case "General":
        return <GeneralSection />;
      case "Suspension":
        return <SuspensionSection />;
      case "Diff":
        return <DrivetrainSection />;
      case "Engine":
        return <EngineSection />;
      case "DAQ":
        return <DaqSection />;
      case "Aero":
        return <AeroSection />;
      default:
        return <GeneralSection />;
    }
  }

  return (
    <main className="workspace-center">
      <div className="engineering-ribbon">
        {availableTabs.map((item) => (
          <button
            key={item}
            className={activeModule === item ? "ribbon-button active" : "ribbon-button"}
            onClick={() => setPage(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="workspace-content">{renderPage()}</div>
    </main>
  );
}
