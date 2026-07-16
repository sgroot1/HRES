import { useSetupStore } from "../../store/setupStore";
import { useWorkspaceStore } from "../../context/workspace";

import GeneralSection from "../editor/general/GeneralSection";
import SuspensionSection from "../editor/suspension/SuspensionSection";
import EngineSection from "../editor/engine/EngineSection";
import DaqSection from "../editor/daq/DaqSection";
import AeroSection from "../editor/aero/AeroSection";
import PerformanceSection from "../editor/performance/PerformanceSection";
import DrivetrainSection from "../editor/drivetrain/DrivetrainSection";

export default function WorkspaceTabs() {

  const setup = useSetupStore(
    state => state.currentSetup
  );

  const page = useWorkspaceStore(
    state => state.module
  );

  const setPage = useWorkspaceStore(
    state => state.setModule
  );

  if (!setup) {

    return (

      <main className="workspace-center">

        <div className="workspace-empty">

          <h2>No Setup Selected</h2>

          <p>

            Select a setup from the Setup Explorer
            to begin editing.

          </p>

        </div>

      </main>

    );

  }

  function renderPage() {

    switch (page) {

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

      case "Performance":
        return <PerformanceSection />;

      default:
        return <GeneralSection />;

    }

  }

  return (

    <main className="workspace-center">

      <div className="engineering-ribbon">
        <div className="ribbon-group">

          <div className="ribbon-label">

            GENERAL

          </div>

          <div className="ribbon-stack">
            <button
              className={
                page === "General"
                  ? "ribbon-button active"
                  : "ribbon-button"
              }
              onClick={() => setPage("General")}
            >
              General
            </button>
          </div>

        </div>

        <div className="ribbon-group">

          <div className="ribbon-label">

            CHASSIS

          </div>

          <div className="ribbon-stack">

            <button
              className={
                page === "Suspension"
                  ? "ribbon-button active"
                  : "ribbon-button"
              }
              onClick={() => setPage("Suspension")}
            >
              Suspension
            </button>

          </div>

        </div>

        <div className="ribbon-group">

          <div className="ribbon-label">

            POWERTRAIN

          </div>

          <div className="ribbon-stack">

            <button
              className={
                page === "Engine"
                  ? "ribbon-button active"
                  : "ribbon-button"
              }
              onClick={() => setPage("Engine")}
            >
              Engine
            </button>

            <button
              className={
                page === "Diff"
                  ? "ribbon-button active"
                  : "ribbon-button"
              }
              onClick={() => setPage("Diff")}
            >
              Diff
            </button>

            <button
              className={
                page === "DAQ"
                  ? "ribbon-button active"
                  : "ribbon-button"
              }
              onClick={() => setPage("DAQ")}
            >
              DAQ
            </button>

          </div>

        </div>

        <div className="ribbon-group">

          <div className="ribbon-label">

            AERODYNAMICS

          </div>

          <div className="ribbon-stack">
            <button
              className={
                page === "Aero"
                  ? "ribbon-button active"
                  : "ribbon-button"
              }
              onClick={() => setPage("Aero")}
            >
              Aero
            </button>
          </div>

        </div>

        <div className="ribbon-group">

          <div className="ribbon-label">

            ENGINEERING

          </div>

          <div className="ribbon-stack">
            <button
              className={
                page === "Performance"
                  ? "ribbon-button active"
                  : "ribbon-button"
              }
              onClick={() => setPage("Performance")}
            >
              Performance
            </button>
          </div>

        </div>

      </div>

      <div className="workspace-content">

        {renderPage()}

      </div>

    </main>

  );

}
