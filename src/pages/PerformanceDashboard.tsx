import { ChangeEvent, useRef, useState } from "react";
import DriverPanel from "../components/editor/performance/DriverPanel";
import EngineerPanel from "../components/editor/performance/EngineerPanel";
import AnalysisPanel from "../components/editor/performance/AnalysisPanel";
import MotecAnalysisPanel from "../components/editor/performance/MotecAnalysisPanel";
import { useRuns } from "../hooks/useRuns";
import { useSetupStore } from "../store/setupStore";
import { parseMotecCsv } from "../services/motecCsv";

export default function PerformanceDashboard() {
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const setup = useSetupStore((state) => state.currentSetup);
  const { currentRun, createRun, updateRun } = useRuns();

  async function handleImportMotecCsv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const content = await file.text();
    const parsed = parseMotecCsv(content);

    const importedDriver = parsed.driver || setup?.general.driver || "Imported Driver";
    const importedTrack = parsed.track || setup?.general.track || "Imported Track";

    if (!currentRun) {
      if (!setup) {
        setImportMessage("Select a setup before importing MoTeC CSV.");
        event.target.value = "";
        return;
      }

      createRun(setup.id, importedDriver, importedTrack);
    }

    const existingComments = currentRun?.comments?.trim() || "";
    const importNote = `Imported telemetry from ${file.name}`;

    updateRun({
      driver: currentRun?.driver || importedDriver,
      track: currentRun?.track || importedTrack,
      bestLap: parsed.bestLap,
      averageLap: parsed.averageLap,
      telemetryFile: file.name,
      motecAnalysis: parsed.analysis,
      comments: existingComments ? `${existingComments}\n${importNote}` : importNote,
    });

    setImportMessage(
      parsed.lapCount > 0
        ? `Imported ${parsed.lapCount} laps from ${file.name}.`
        : `Imported ${parsed.analysis.sampleCount} samples from ${file.name}. No lap-time column was found, but channel analysis is available below.`
    );

    event.target.value = "";
  }

  return (
    <div className="performance-dashboard-shell">

      <AppHeader />

      <div className="compare-header performance-dashboard-header">
        <div>
          <div className="compare-kicker">Performance Sheet</div>
          <h1>Performance</h1>
          <p className="performance-dashboard-subtitle">Driver feedback, engineering notes, and MoTeC-linked run metrics.</p>
          {importMessage && <p className="performance-dashboard-import-message">{importMessage}</p>}
        </div>

        <div className="performance-dashboard-actions">
          <button className="secondary-action" onClick={() => fileInputRef.current?.click()}>
            Import MoTeC CSV
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          className="runs-hidden-file-input"
          onChange={handleImportMotecCsv}
        />
      </div>

      <div className="general-grid module-sheet-grid performance-dashboard-grid">
        <MotecAnalysisPanel />
        <DriverPanel />
        <EngineerPanel />
        <AnalysisPanel />
      </div>

    </div>

  );

}
