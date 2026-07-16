import { TireSetup } from "../types/tires";
import {
  calculatePressureGain,
  calculateAverageTemperature,
} from "../calculations/tires";

export interface TireKPI {

  pressureGain: number | null;

  averageTemperature: number | null;

}

export function getFrontLeftTireKPI(
  tires: TireSetup
): TireKPI {

  return {

    pressureGain: calculatePressureGain(

      tires.lf.coldPressure,

      tires.lf.hotPressure

    ),

    averageTemperature:

      calculateAverageTemperature(

        tires.lf

      ),

  };

}
