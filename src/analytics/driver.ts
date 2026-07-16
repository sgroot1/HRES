import { PerformanceSetup } from "../types/performance";

export function getDriverRating(
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

  if (values.length === 0) {
    return null;
  }

  const average =
    values.reduce((a, b) => a + b, 0) /
    values.length;

  return Number(average.toFixed(1));

}

export function getDriverGrade(
  rating: number | null
): string {

  if (rating === null) return "--";

  if (rating >= 9) return "Excellent";

  if (rating >= 8) return "Very Good";

  if (rating >= 7) return "Good";

  if (rating >= 6) return "Average";

  return "Needs Improvement";

}
