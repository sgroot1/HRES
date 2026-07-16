export interface CornerData {
  camber: number | null;
  toe: number | null;
  caster: number | null;
  rideHeight: number | null;
  cornerWeight: number | null;

  springRate: number | null;
  springPreload: number | null;

  lowSpeedBump: number | null;
  highSpeedBump: number | null;
  lowSpeedRebound: number | null;
  highSpeedRebound: number | null;
}

export interface SuspensionSetup {
  lf: CornerData;
  rf: CornerData;
  lr: CornerData;
  rr: CornerData;
  frontArb: number | null;
  rearArb: number | null;
}
