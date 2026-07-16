import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../layout/TopNav";
import SetupList from "./SetupList";
import WorkspaceTabs from "./WorkspaceTabs";
import EngineeringSidebar from "./EngineeringSidebar";
import { useSetupStore } from "../../store/setupStore";
import { useSessionStore } from "../../store/sessionStore";

export default function Workspace() {
  const navigate = useNavigate();
  const session = useSessionStore((state) => state.session);
  const setups = useSetupStore((state) => state.setups);
  const createSetup = useSetupStore((state) => state.createSetup);
  const openSetup = useSetupStore((state) => state.openSetup);

  const hasAnySetup = useMemo(() => setups.length > 0, [setups.length]);

  const handleCreateSetup = () => {
    const created = createSetup("Baseline Setup");
    openSetup(created.id);
  };

  return (
    <div className="workspace-shell">
      <TopNav />

      <div className="workspace-actions-bar">
        <button className="secondary-action workspace-new-session" onClick={() => navigate("/new-session")}>
          New Session
        </button>
      </div>

      <div className="workspace">
        <aside className="workspace-left">
          <SetupList />
        </aside>

        <main className="workspace-center">
          {!hasAnySetup ? (
            <div className="workspace-onboarding">
              <div className="workspace-onboarding-card">
                <p className="section-label">Quick Start</p>
                <h2>Start your first setup</h2>
                <p>
                  {session
                    ? `Session ${session.name} is ready. Create a baseline setup to begin engineering work.`
                    : "Create a baseline setup to begin engineering work."}
                </p>
                <div className="new-session-actions">
                  <button className="primary-action" onClick={handleCreateSetup}>
                    Create Baseline Setup
                  </button>
                  <button className="secondary-action" onClick={() => navigate("/new-session")}>
                    New Session
                  </button>
                  <button className="secondary-action" onClick={() => navigate("/database")}>
                    Open Database
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <WorkspaceTabs />
          )}
        </main>

        <aside className="workspace-right">
          <EngineeringSidebar />
        </aside>
      </div>
    </div>
  );
}
