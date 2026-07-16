import { useRuns } from "../../../hooks/useRuns";

function formatNumber(value: number | null, digits = 2): string {
  if (value == null || Number.isNaN(value)) return "--";
  return value.toFixed(digits);
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (!values.length) {
    return <div className="motec-chart-empty">No channel data</div>;
  }

  const width = 340;
  const height = 82;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1e-6, max - min);

  const points = values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * width;
      const y = height - ((value - min) / span) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="motec-chart-svg">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function OverlayPlot({ a, b, colorA, colorB }: { a: number[]; b: number[]; colorA: string; colorB: string }) {
  if (!a.length && !b.length) {
    return <div className="motec-chart-empty">No channel data</div>;
  }

  const width = 340;
  const height = 82;
  const combined = [...a, ...b];
  const min = Math.min(...combined);
  const max = Math.max(...combined);
  const span = Math.max(1e-6, max - min);

  const as = (values: number[]) => values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * width;
      const y = height - ((value - min) / span) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="motec-chart-svg">
      {!!a.length && <polyline points={as(a)} fill="none" stroke={colorA} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />}
      {!!b.length && <polyline points={as(b)} fill="none" stroke={colorB} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />}
    </svg>
  );
}

function Histogram({ values, color }: { values: number[]; color: string }) {
  if (!values.length) {
    return <div className="motec-chart-empty">No channel data</div>;
  }

  const bins = 18;
  const width = 340;
  const height = 86;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1e-6, max - min);
  const counts = new Array<number>(bins).fill(0);

  for (const value of values) {
    const normalized = (value - min) / span;
    const index = Math.min(bins - 1, Math.max(0, Math.floor(normalized * bins)));
    counts[index] += 1;
  }

  const peak = Math.max(...counts, 1);
  const barW = width / bins;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="motec-chart-svg">
      {counts.map((count, index) => {
        const h = (count / peak) * (height - 6);
        const y = height - h;
        return (
          <rect
            key={index}
            x={index * barW + 1}
            y={y}
            width={Math.max(1, barW - 2)}
            height={h}
            fill={color}
            opacity={0.8}
          />
        );
      })}
    </svg>
  );
}

function TrackMap({ lat, lon }: { lat: number[]; lon: number[] }) {
  if (!lat.length || !lon.length) {
    return <div className="motec-chart-empty">No GPS trace available</div>;
  }

  const points = lat
    .map((value, index) => ({ lat: value, lon: lon[index] }))
    .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lon));

  if (points.length < 2) {
    return <div className="motec-chart-empty">No GPS trace available</div>;
  }

  const minLat = Math.min(...points.map((point) => point.lat));
  const maxLat = Math.max(...points.map((point) => point.lat));
  const minLon = Math.min(...points.map((point) => point.lon));
  const maxLon = Math.max(...points.map((point) => point.lon));
  const latSpan = Math.max(1e-9, maxLat - minLat);
  const lonSpan = Math.max(1e-9, maxLon - minLon);

  const width = 340;
  const height = 180;
  const pointsString = points.map((point) => {
    const x = ((point.lon - minLon) / lonSpan) * width;
    const y = height - ((point.lat - minLat) / latSpan) * height;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="motec-track-svg">
      <polyline points={pointsString} fill="none" stroke="#8be9fd" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function MotecAnalysisPanel() {
  const { currentRun } = useRuns();
  const analysis = currentRun?.motecAnalysis;

  return (
    <div className="general-column motec-analysis-panel">
      <h2>PERFORMANCE</h2>

      {!analysis && (
        <div className="field">
          <label>Status</label>
          <input readOnly value="Import a MoTeC CSV to populate analysis." />
        </div>
      )}

      {analysis && (
        <div className="motec-analysis-content">
          <div className="motec-best-lap-block">
            <span>Best Lap</span>
            <strong>{formatNumber(currentRun?.bestLap ?? null, 3)}</strong>
          </div>

          <section className="motec-section">
            <div className="motec-section-title">Lap Time Trend</div>
            <Sparkline values={analysis.lapTimesSeconds} color="#f1fa8c" />
          </section>

          <section className="motec-section">
            <div className="motec-section-title">Speed Trace</div>
            <Sparkline values={analysis.speedTraceKph} color="#8be9fd" />
          </section>

          <section className="motec-section">
            <div className="motec-section-title">Throttle / Brake Overlay</div>
            <OverlayPlot
              a={analysis.throttleTracePct}
              b={analysis.brakeTracePct}
              colorA="#50fa7b"
              colorB="#ff5555"
            />
          </section>

          <section className="motec-section">
            <div className="motec-section-title">RPM</div>
            <Sparkline values={analysis.rpmTrace} color="#bd93f9" />
          </section>

          <div className="motec-kpi-grid">
            <div className="motec-kpi-card"><span>Telemetry File</span><strong>{currentRun?.telemetryFile || "Attached"}</strong></div>
            <div className="motec-kpi-card"><span>Samples</span><strong>{analysis.sampleCount}</strong></div>
            <div className="motec-kpi-card"><span>Duration (s)</span><strong>{formatNumber(analysis.durationSeconds, 3)}</strong></div>
            <div className="motec-kpi-card"><span>Top Speed (km/h)</span><strong>{formatNumber(analysis.maxSpeedKph, 1)}</strong></div>
            <div className="motec-kpi-card"><span>Average Speed (km/h)</span><strong>{formatNumber(analysis.avgSpeedKph, 1)}</strong></div>
            <div className="motec-kpi-card"><span>Peak Engine Speed (rpm)</span><strong>{formatNumber(analysis.maxEngineRpm, 0)}</strong></div>
            <div className="motec-kpi-card"><span>Average Throttle (%)</span><strong>{formatNumber(analysis.avgThrottlePct, 1)}</strong></div>
            <div className="motec-kpi-card"><span>Average Brake Load (%)</span><strong>{formatNumber(analysis.avgBrakePct, 1)}</strong></div>
            <div className="motec-kpi-card"><span>Max Front Brake Pressure</span><strong>{formatNumber(analysis.maxBrakeFront, 1)}</strong></div>
            <div className="motec-kpi-card"><span>Max Rear Brake Pressure</span><strong>{formatNumber(analysis.maxBrakeRear, 1)}</strong></div>
            <div className="motec-kpi-card"><span>Peak Lateral G</span><strong>{formatNumber(analysis.peakLateralG, 3)}</strong></div>
            <div className="motec-kpi-card"><span>Peak Longitudinal G</span><strong>{formatNumber(analysis.peakLongitudinalG, 3)}</strong></div>
          </div>

          <div className="motec-chart-grid hist-grid">
            <section className="motec-chart-card">
              <header>
                <h3>Throttle Histogram</h3>
                <span>%</span>
              </header>
              <Histogram values={analysis.throttleTracePct} color="#50fa7b" />
            </section>

            <section className="motec-chart-card">
              <header>
                <h3>Brake Histogram</h3>
                <span>%</span>
              </header>
              <Histogram values={analysis.brakeTracePct} color="#ff5555" />
            </section>

            <section className="motec-chart-card">
              <header>
                <h3>RPM Histogram</h3>
                <span>rpm</span>
              </header>
              <Histogram values={analysis.rpmTrace} color="#bd93f9" />
            </section>

            <section className="motec-chart-card">
              <header>
                <h3>Track Map</h3>
                <span>GPS</span>
              </header>
              <TrackMap lat={analysis.gpsLatTrace} lon={analysis.gpsLonTrace} />
            </section>
          </div>

          <div className="field">
            <label>Detected Channels</label>
            <textarea
              readOnly
              rows={2}
              className="motec-channels-list"
              value={analysis.channelsDetected.length ? analysis.channelsDetected.join(", ") : "None detected"}
            />
          </div>
        </div>
      )}
    </div>
  );
}
