export interface BrakeCorner {
  rotorTemperature: number | null;
  padThickness: number | null;
  brakePressure: number | null;
  brakeWear: number | null;
}

export interface BrakeSetup {
  lf: BrakeCorner;
  rf: BrakeCorner;
  lr: BrakeCorner;
  rr: BrakeCorner;

  frontBias: number | null;
  rearBias: number | null;

  masterCylinder: string;

  pedalRatio: number | null;

  notes: string;
}
