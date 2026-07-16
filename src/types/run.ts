import { MotecAnalysisSummary } from "./motec";

export interface RunLogCorner {
  coldPsi: string;
  hotPsi: string;
  tempOutside: string;
  tempMiddle: string;
  tempInside: string;
}

export interface RunDriverFeedback {
  entry: string;
  mid: string;
  exit: string;
  stability: string;
  consistency: string;
  balance: string;
  grip: string;
}

export interface RunLog {
  date: string;
  time: string;
  amPm: string;
  filledBy: string;
  testName: string;
  location: string;
  weather: string;
  tempAir: string;
  tempTrack: string;
  windSpeed: string;
  windDirection: string;
  humidity: string;
  trackConfig: string;
  carChanges: string;
  bestTime: string;
  averageTime: string;
  notes: string;
  fl: RunLogCorner;
  fr: RunLogCorner;
  rl: RunLogCorner;
  rr: RunLogCorner;
  feedback: RunDriverFeedback;
}

export enum RunStatus {
  Planned = "Planned",
  Running = "Running",
  Complete = "Complete",
  Cancelled = "Cancelled",
}

export interface Run {

  id: string;

  number: number;

  setupId: string;

  driver: string;

  track: string;

  weather: string;

  startTime: string;

  endTime: string;

  comments: string;

  telemetryFile: string;

  videoFile: string;

  photos: string[];

  bestLap: number | null;

  averageLap: number | null;

  motecAnalysis: MotecAnalysisSummary | null;

  runLog: RunLog;

  status: RunStatus;

}
