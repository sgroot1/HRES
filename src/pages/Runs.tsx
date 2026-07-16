import { ChangeEvent, useRef, useState } from "react";

import TopNav from "../components/layout/TopNav";

import RunList from "../components/editor/runs/RunList";
import NewRunDialog from "../components/editor/runs/NewRunDialog";
import RunLogSheet from "../components/editor/runs/RunLogSheet";
import { useRuns } from "../hooks/useRuns";
import { useSetupStore } from "../store/setupStore";
import { parseMotecCsv } from "../services/motecCsv";

export default function Runs() {

  const [dialogOpen, setDialogOpen] =
    useState(false);
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
        : `Imported ${parsed.analysis.sampleCount} samples from ${file.name}. No lap-time column was found.`
    );

    event.target.value = "";
  }

  return (

    <div className="app">

      <TopNav />

      <div className="runs-shell">
        <div className="compare-header runs-header">
          <div>
            <div className="compare-kicker">Run Sheet</div>
            <h1>Runs</h1>
            <p className="runs-subtitle">Track test runs</p>
            {importMessage && <p className="runs-import-message">{importMessage}</p>}
          </div>

          <div className="runs-actions">
            <button
              className="secondary-action runs-new-run"
              onClick={() => fileInputRef.current?.click()}
            >
              Import MoTeC CSV
            </button>

            <button
              className="secondary-action runs-new-run"
              onClick={() => setDialogOpen(true)}
            >
              + New Run
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

        <RunList />

        {currentRun ? (
          <RunLogSheet
            run={currentRun}
            onChange={updateRun}
          />
        ) : (
          <div className="runs-log-placeholder">
            Open a run (or create one) to edit the full run log sheet.
          </div>
        )}
      </div>

      <NewRunDialog

        open={dialogOpen}

        onClose={() =>
          setDialogOpen(false)
        }

      />

    </div>

  );

}
