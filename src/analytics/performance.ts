import { Run } from "../types/run";

export function getBestLap(
  run: Run | null
): string {

  if (!run || run.bestLap == null) {

    return "--";

  }

  return `${run.bestLap.toFixed(3)} s`;

}

export function getAverageLap(
  run: Run | null
): string {

  if (!run || run.averageLap == null) {

    return "--";

  }

  return `${run.averageLap.toFixed(3)} s`;

}

export function telemetryAvailable(
  run: Run | null
): boolean {

  return !!run?.telemetryFile;

}
