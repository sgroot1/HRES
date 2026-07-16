import { PerformanceSetup } from "../types/performance";

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

      values.reduce(

        (a, b) => a + b,

        0

      ) / values.length

    ).toFixed(1)

  );

}
