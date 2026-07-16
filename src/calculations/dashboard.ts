import { PerformanceSetup } from "../types/performance";
import { Run } from "../types/run";

export function getOverallDriverRating(
  performance: PerformanceSetup
): number | null {

  const values = [

    performance.entryBalance,

    performance.midCornerBalance,

    performance.exitBalance,

    performance.brakingStability,

    performance.traction,

    performance.confidence,

  ].filter(
    (v): v is number => v !== null
  );

  if (!values.length) return null;

  return Number(
    (
      values.reduce((a, b) => a + b, 0) /
      values.length
    ).toFixed(1)
  );

}

export function getBestLap(
  run: Run | null
): string {

  if (!run || run.bestLap == null)
    return "--";

  return `${run.bestLap.toFixed(3)} s`;

}

export function getAverageLap(
  run: Run | null
): string {

  if (!run || run.averageLap == null)
    return "--";

  return `${run.averageLap.toFixed(3)} s`;

}

export function hasTelemetry(
  run: Run | null
): boolean {

  return !!run?.telemetryFile;

}
