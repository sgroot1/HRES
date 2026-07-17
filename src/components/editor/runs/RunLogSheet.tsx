import { Run, RunLog, RunLogCorner, RunStatus } from "../../../types/run";

interface Props {
  run: Run;
  onChange(values: Partial<Run>): void;
}

function CornerBlock({
  label,
  value,
  onChange,
}: {
  label: string;
  value: RunLogCorner;
  onChange(values: RunLogCorner): void;
}) {
  return (
    <div className="runlog-corner-card">
      <h3>{label}</h3>
      <div className="runlog-corner-grid">
        <label className="field"><span>Cold PSI</span><input value={value.coldPsi} onChange={(event) => onChange({ ...value, coldPsi: event.target.value })} placeholder="24.5" /></label>
        <label className="field"><span>Hot PSI</span><input value={value.hotPsi} onChange={(event) => onChange({ ...value, hotPsi: event.target.value })} placeholder="28.0" /></label>
        <label className="field"><span>Outside</span><input value={value.tempOutside} onChange={(event) => onChange({ ...value, tempOutside: event.target.value })} placeholder="108" /></label>
        <label className="field"><span>Middle</span><input value={value.tempMiddle} onChange={(event) => onChange({ ...value, tempMiddle: event.target.value })} placeholder="112" /></label>
        <label className="field"><span>Inside</span><input value={value.tempInside} onChange={(event) => onChange({ ...value, tempInside: event.target.value })} placeholder="110" /></label>
      </div>
    </div>
  );
}

export default function RunLogSheet({ run, onChange }: Props) {
  const log = run.runLog;

  function patchLog(values: Partial<RunLog>) {
    onChange({ runLog: { ...log, ...values } });
  }

  return (
    <section className="runlog-sheet">
      <div className="runlog-header">
        <div>
          <div className="compare-kicker">Run Log</div>
          <h2>Run {run.number}</h2>
        </div>
        <label className="field run-status-field">
          <span>Status</span>
          <select value={run.status} onChange={(event) => onChange({ status: event.target.value as RunStatus })}>
            {Object.values(RunStatus).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="runlog-grid runlog-grid-top">
        <label className="field"><span>Date</span><input value={log.date} onChange={(event) => patchLog({ date: event.target.value })} /></label>
        <label className="field"><span>Time</span><input value={log.time} onChange={(event) => patchLog({ time: event.target.value })} /></label>
        <label className="field"><span>AM/PM</span><input value={log.amPm} onChange={(event) => patchLog({ amPm: event.target.value })} /></label>
        <label className="field"><span>Filled By</span><input value={log.filledBy} onChange={(event) => patchLog({ filledBy: event.target.value })} /></label>
        <label className="field"><span>Test Name</span><input value={log.testName} onChange={(event) => patchLog({ testName: event.target.value })} /></label>
        <label className="field"><span>Location</span><input value={log.location} onChange={(event) => patchLog({ location: event.target.value })} /></label>
        <label className="field"><span>Driver</span><input value={run.driver} onChange={(event) => onChange({ driver: event.target.value })} /></label>
        <label className="field"><span>Track Config</span><input value={log.trackConfig} onChange={(event) => patchLog({ trackConfig: event.target.value })} /></label>
      </div>

      <div className="runlog-grid runlog-grid-conditions">
        <label className="field"><span>Weather</span><input value={log.weather} onChange={(event) => patchLog({ weather: event.target.value })} /></label>
        <label className="field"><span>Air Temp</span><input value={log.tempAir} onChange={(event) => patchLog({ tempAir: event.target.value })} /></label>
        <label className="field"><span>Track Temp</span><input value={log.tempTrack} onChange={(event) => patchLog({ tempTrack: event.target.value })} /></label>
        <label className="field"><span>Wind Speed</span><input value={log.windSpeed} onChange={(event) => patchLog({ windSpeed: event.target.value })} /></label>
        <label className="field"><span>Wind Dir</span><input value={log.windDirection} onChange={(event) => patchLog({ windDirection: event.target.value })} /></label>
        <label className="field"><span>Humidity</span><input value={log.humidity} onChange={(event) => patchLog({ humidity: event.target.value })} /></label>
      </div>

      <div className="runlog-corners-grid">
        <CornerBlock label="FL" value={log.fl} onChange={(values) => patchLog({ fl: values })} />
        <CornerBlock label="FR" value={log.fr} onChange={(values) => patchLog({ fr: values })} />
        <CornerBlock label="RL" value={log.rl} onChange={(values) => patchLog({ rl: values })} />
        <CornerBlock label="RR" value={log.rr} onChange={(values) => patchLog({ rr: values })} />
      </div>

      <div className="runlog-grid runlog-grid-feedback">
        <label className="field"><span>Entry</span><input value={log.feedback.entry} onChange={(event) => patchLog({ feedback: { ...log.feedback, entry: event.target.value } })} /></label>
        <label className="field"><span>Mid</span><input value={log.feedback.mid} onChange={(event) => patchLog({ feedback: { ...log.feedback, mid: event.target.value } })} /></label>
        <label className="field"><span>Exit</span><input value={log.feedback.exit} onChange={(event) => patchLog({ feedback: { ...log.feedback, exit: event.target.value } })} /></label>
        <label className="field"><span>Stability</span><input value={log.feedback.stability} onChange={(event) => patchLog({ feedback: { ...log.feedback, stability: event.target.value } })} /></label>
        <label className="field"><span>Consistency</span><input value={log.feedback.consistency} onChange={(event) => patchLog({ feedback: { ...log.feedback, consistency: event.target.value } })} /></label>
        <label className="field"><span>Balance</span><input value={log.feedback.balance} onChange={(event) => patchLog({ feedback: { ...log.feedback, balance: event.target.value } })} /></label>
        <label className="field"><span>Grip</span><input value={log.feedback.grip} onChange={(event) => patchLog({ feedback: { ...log.feedback, grip: event.target.value } })} /></label>
      </div>

      <div className="runlog-grid runlog-grid-times">
        <label className="field"><span>Car Changes</span><input value={log.carChanges} onChange={(event) => patchLog({ carChanges: event.target.value })} /></label>
        <label className="field"><span>Best Time</span><input value={log.bestTime} onChange={(event) => patchLog({ bestTime: event.target.value })} /></label>
        <label className="field"><span>Average Time</span><input value={log.averageTime} onChange={(event) => patchLog({ averageTime: event.target.value })} /></label>
      </div>

      <label className="field runlog-notes-field">
        <span>Notes</span>
        <textarea value={log.notes} rows={4} onChange={(event) => patchLog({ notes: event.target.value })} placeholder="Driver comments, lap tags, flag conditions..." />
      </label>
    </section>
  );
}
