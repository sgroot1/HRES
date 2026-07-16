import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Sidebar from "../components/editor/Sidebar";
import GeneralSection from "../components/editor/general/GeneralSection";
import SuspensionSection from "../components/editor/suspension/SuspensionSection";

import { useSetupStore } from "../store/setupStore";

export default function SetupEditor() {
  const [section, setSection] = useState("General");
  const navigate = useNavigate();
  const location = useLocation();

  const setup = useSetupStore((state) => state.currentSetup);
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo ?? "/compare";

  if (!setup) {
    return (
      <div className="app">
        <h1>No Setup Selected</h1>
        <p>Please return to the Setup Database and open a setup.</p>
      </div>
    );
  }

  return (
    <div className="app">

      <header className="page-header">

        <div>

          <h1>{setup.name}</h1>

          <p>
            Version {setup.version} • {setup.status}
          </p>

        </div>

        <button
          className="secondary-action"
          onClick={() => navigate(returnTo)}
        >
          Back to Compare
        </button>

      </header>

      <div className="editor-layout">

        <Sidebar
          selected={section}
          onSelect={setSection}
        />

        <main className="editor-content">

          {section === "General" && (
            <GeneralSection />
          )}

          {section === "Engine" && (
            <div>
              <h2>Engine</h2>
              <p>Engine section coming next.</p>
            </div>
          )}

          {section === "DAQ" && (
            <div>
              <h2>DAQ</h2>
              <p>DAQ section coming next.</p>
            </div>
          )}

          {section === "Suspension" && (
            <SuspensionSection />
          )}
              
          {section === "Performance Analysis" && (
            <div>
              <h2>Performance Analysis</h2>
              <p>Performance Analysis coming next.</p>
            </div>
          )}

          {section === "Brakes" && (
            <div>
              <h2>Brakes</h2>
              <p>Brake section coming next.</p>
            </div>
          )}

          {section === "Drivetrain" && (
            <div>
              <h2>Drivetrain</h2>
              <p>Drivetrain section coming next.</p>
            </div>
          )}

          {section === "Aerodynamics" && (
            <div>
              <h2>Aerodynamics</h2>
              <p>Aerodynamics section coming next.</p>
            </div>
          )}

        </main>

      </div>

    </div>
  );
}
