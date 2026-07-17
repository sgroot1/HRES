import type { ReactNode } from "react";
import { useRunStore } from "../../store/runStore";
import { useSetupStore } from "../../store/setupStore";
import { useSessionStore } from "../../store/sessionStore";

import {
  getDriverRating,
  getDriverGrade,
  getBestLap,
  getAverageLap,
  telemetryAvailable,
  getRecommendation,
} from "../../analytics";

function SidebarCard({
  title,
  children,
  tone = "neutral",
}: {
  title: string;
  children: ReactNode;
  tone?: "neutral" | "gold";
}) {
  return (
    <section className={tone === "gold" ? "sidebar-card sidebar-card-gold" : "sidebar-card"}>
      <div className="sidebar-card-title">{title}</div>
      {children}
    </section>
  );
}

export default function EngineeringSidebar() {
  const session = useSessionStore((state) => state.session);
  const setup = useSetupStore((state) => state.currentSetup);
  const run = useRunStore((state) => state.currentRun);

  const rating = setup?.performance ? getDriverRating(setup.performance) : null;
  const grade = getDriverGrade(rating);
  const recommendation = getRecommendation();

  return (
    <aside className="engineering-sidebar">
      <SidebarCard title="Current Session">
        <div className="sidebar-summary-block">
          <div>
            <span>Session</span>
            <strong>{session?.name ?? "--"}</strong>
          </div>
          <div>
            <span>Vehicle</span>
            <strong>{session?.vehicle ?? "--"}</strong>
          </div>
          <div>
            <span>Driver</span>
            <strong>{run?.driver ?? session?.driver ?? "--"}</strong>
          </div>
          <div>
            <span>Track</span>
            <strong>{run?.track ?? session?.track ?? "--"}</strong>
          </div>
          <div>
            <span>Setup</span>
            <strong>{setup?.name ?? "--"}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>{setup?.status ?? "--"}</strong>
          </div>
        </div>
      </SidebarCard>

      <SidebarCard title="Run Status">
        <div className="sidebar-kpi-grid">
          <div className="kpi-card compact">
            <label>Best Lap</label>
            <strong>{getBestLap(run)}</strong>
          </div>
          <div className="kpi-card compact">
            <label>Average Lap</label>
            <strong>{getAverageLap(run)}</strong>
          </div>
          <div className="kpi-card compact">
            <label>Driver Rating</label>
            <strong>{rating ?? "--"}</strong>
            <small>{grade}</small>
          </div>
        </div>
      </SidebarCard>

      <SidebarCard title="Telemetry / Conditions">
        <div className="sidebar-summary-block">
          <div>
            <span>Weather</span>
            <strong>{run?.weather ?? "--"}</strong>
          </div>
          <div>
            <span>Telemetry</span>
            <strong>{telemetryAvailable(run) ? "Attached" : "None"}</strong>
          </div>
          <div>
            <span>Run State</span>
            <strong>{run?.status ?? "--"}</strong>
          </div>
        </div>
      </SidebarCard>

      <SidebarCard title="Engineer Callout" tone="gold">
        <div className="recommendation-card compact">
          <strong>{recommendation.title}</strong>
          <div className="recommendation-meta">Confidence {recommendation.confidence}%</div>
        </div>
      </SidebarCard>
    </aside>
  );
}
