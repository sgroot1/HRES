export interface DrivetrainSetup {
  differentialMode?: string;
  preloadNm?: number | null;
  rampAngleAccelDeg?: number | null;
  rampAngleDecelDeg?: number | null;
  finalDriveRatio?: number | null;
  chainTensionMm?: number | null;
  powerLockPercent?: number | null;
  coastLockPercent?: number | null;
  notes?: string;
}
