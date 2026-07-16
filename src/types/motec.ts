export interface MotecAnalysisSummary {
  sampleCount: number;
  durationSeconds: number | null;
  channelCount: number;
  channelsDetected: string[];
  maxSpeedKph: number | null;
  avgSpeedKph: number | null;
  maxEngineRpm: number | null;
  avgThrottlePct: number | null;
  avgBrakePct: number | null;
  maxBrakeFront: number | null;
  maxBrakeRear: number | null;
  peakLateralG: number | null;
  peakLongitudinalG: number | null;
  lapTimesSeconds: number[];
  timeTraceSeconds: number[];
  speedTraceKph: number[];
  throttleTracePct: number[];
  brakeTracePct: number[];
  rpmTrace: number[];
  gpsLatTrace: number[];
  gpsLonTrace: number[];
}
