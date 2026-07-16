import { useMemo } from "react";

import { useRunStore } from "../../store/runStore";
import { useSessionStore } from "../../store/sessionStore";
import { useSetupStore } from "../../store/setupStore";

interface HealthItem {
  label: string;
  ok: boolean;
}

export default function EngineeringHealth() {
  const session = useSessionStore((state) => state.session);
  const setup = useSetupStore((state) => state.currentSetup);
  const run = useRunStore((state) => state.currentRun);

  const checks = useMemo<HealthItem[]>(
    () => [
      { label: "Session Active", ok: !!session },
      { label: "Setup Selected", ok: !!setup },
      { label: "Run Selected", ok: !!run },
      { label: "Telemetry Imported", ok: !!run?.telemetryFile },
      { label: "Driver Notes", ok: !!run?.comments?.trim() },
      { label: "Best Lap Recorded", ok: run?.bestLap != null },
    ],
    [session, setup, run]
  );

  const completed = checks.filter((item) => item.ok).length;
  const score = Math.round((completed / checks.length) * 100);

  return (
    <section className="health-card">
      <div className="section-header">
        <h2>ENGINEERING HEALTH</h2>
      </div>

      <div className="health-grid">
        {checks.map((check) => (
          <div key={check.label} className="health-row">
            <div
              className={
                check.ok ? "health-dot success" : "health-dot warning"
              }
            />
            <div className="health-text">
              <strong>{check.label}</strong>
              <small>{check.ok ? "Ready" : "Missing"}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="health-score">
        <div className="health-progress">
          <div
            className="health-progress-fill"
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="health-score-label">
          <span>Engineering Readiness</span>
          <strong>{score}%</strong>
        </div>
      </div>
    </section>
  );
}
