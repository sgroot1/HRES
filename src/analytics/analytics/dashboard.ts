import { Setup } from "../types/setup";
import { Run } from "../types/run";

import {
  getDriverRating,
  getDriverGrade,
} from "./driver";

import {
  getBestLap,
  getAverageLap,
  telemetryAvailable,
} from "./performance";

import {
  getRecommendation,
} from "./recommendation";

export interface DashboardSummary {

  driverRating: number | null;

  driverGrade: string;

  bestLap: string;

  averageLap: string;

  telemetry: boolean;

  recommendation: string;

  confidence: number;

}

export function buildDashboardSummary(

  setup: Setup | null,

  run: Run | null

): DashboardSummary {

  const rating =

    setup?.performance

      ? getDriverRating(
          setup.performance
        )

      : null;

  const recommendation =
    getRecommendation();

  return {

    driverRating: rating,

    driverGrade:
      getDriverGrade(rating),

    bestLap:
      getBestLap(run),

    averageLap:
      getAverageLap(run),

    telemetry:
      telemetryAvailable(run),

    recommendation:
      recommendation.title,

    confidence:
      recommendation.confidence,

  };

}
