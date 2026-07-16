import { TireSetup } from "../types/tires";

export function getPressureGain(
  cold: number | null,
  hot: number | null
): number | null {

  if (cold == null || hot == null) {
    return null;
  }

  return Number((hot - cold).toFixed(1));

}

export function getAveragePressureGain(
  tires: TireSetup
): number | null {

  const gains = [

    getPressureGain(
      tires.lf.coldPressure,
      tires.lf.hotPressure
    ),

    getPressureGain(
      tires.rf.coldPressure,
      tires.rf.hotPressure
    ),

    getPressureGain(
      tires.lr.coldPressure,
      tires.lr.hotPressure
    ),

    getPressureGain(
      tires.rr.coldPressure,
      tires.rr.hotPressure
    ),

  ].filter(
    (v): v is number => v !== null
  );

  if (!gains.length) return null;

  return Number(

    (
      gains.reduce((a, b) => a + b, 0) /
      gains.length

    ).toFixed(1)

  );

}
