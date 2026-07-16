import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppHeader from "./components/layout/AppHeader";
import MissionControl from "./pages/MissionControl";
import Workspace from "./components/workspace/Workspace";
import NewSession from "./pages/NewSession";
import SetupDatabase from "./pages/SetupDatabase";
import SetupCompare from "./pages/SetupCompare";
import SetupEditor from "./pages/SetupEditor";
import Runs from "./pages/Runs";
import PerformanceDashboard from "./pages/PerformanceDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <div className="page-shell">
          <div className="page-content">
            <Routes>
              <Route path="/" element={<MissionControl />} />
              <Route path="/workspace" element={<Workspace />} />
              <Route path="/new-session" element={<NewSession />} />
              <Route path="/database" element={<SetupDatabase />} />
              <Route path="/runs" element={<Runs />} />
              <Route path="/dashboard" element={<PerformanceDashboard />} />
              <Route path="/performance" element={<Navigate to="/dashboard" replace />} />
              <Route path="/compare" element={<SetupCompare />} />
              <Route path="/editor" element={<SetupEditor />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
