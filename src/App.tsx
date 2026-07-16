import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import MissionControl from "./pages/MissionControl";
import Workspace from "./components/workspace/Workspace";

import NewSession from "./pages/NewSession";
import SetupDatabase from "./pages/SetupDatabase";
import SetupCompare from "./pages/SetupCompare";
import SetupEditor from "./pages/SetupEditor";
import Runs from "./pages/Runs";
import PerformanceDashboard from "./pages/PerformanceDashboard";
import { host } from "./hostBridge";

function PluginRouteBridge() {
  const location = useLocation();

  useEffect(() => {
    void host.setContext({
      path: location.pathname,
    });
  }, [location.pathname]);

  return null;
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app page-shell" style={{ paddingTop: 24 }}>
      <div className="page page-content" style={{ paddingTop: 8 }}>
        {children}
      </div>
    </div>
  );
}

export default function App() {

  return (

    <BrowserRouter>
      <PluginRouteBridge />

      <Routes>

        {/* =====================================================
            HOME
        ====================================================== */}

        <Route
          path="/"
          element={
            <PageShell>
              <MissionControl />
            </PageShell>
          }
        />

        {/* =====================================================
            ENGINEERING WORKSPACE
        ====================================================== */}

        <Route
          path="/workspace"
          element={
            <PageShell>
              <Workspace />
            </PageShell>
          }
        />

        {/* =====================================================
            SESSION
        ====================================================== */}

        <Route
          path="/new-session"
          element={
            <PageShell>
              <NewSession />
            </PageShell>
          }
        />

        {/* =====================================================
            DATABASE
        ====================================================== */}

        <Route
          path="/database"
          element={
            <PageShell>
              <SetupDatabase />
            </PageShell>
          }
        />

        {/* =====================================================
            RUN REVIEW
        ====================================================== */}

        <Route
          path="/runs"
          element={
            <PageShell>
              <Runs />
            </PageShell>
          }
        />

        {/* =====================================================
            PERFORMANCE
        ====================================================== */}

        <Route
          path="/performance"
          element={
            <PageShell>
              <PerformanceDashboard />
            </PageShell>
          }
        />

        <Route
          path="/dashboard"
          element={<Navigate to="/performance" replace />}
        />

        {/* =====================================================
            SETUP COMPARISON
        ====================================================== */}

        <Route
          path="/compare"
          element={
            <PageShell>
              <SetupCompare />
            </PageShell>
          }
        />

        {/* =====================================================
            SETUP EDITOR
        ====================================================== */}

        <Route
          path="/editor"
          element={
            <PageShell>
              <SetupEditor />
            </PageShell>
          }
        />

        {/* =====================================================
            FALLBACK
        ====================================================== */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </BrowserRouter>

  );

}
