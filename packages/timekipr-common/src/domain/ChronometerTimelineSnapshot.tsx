import { ChronometerSnapshot } from "./ChronometerSnapshot";

export interface ChronometerTimelineSnapshot {
  chronometers: ChronometerSnapshot[];
  currentChronometer: ChronometerSnapshot | null;
  elapsedTimeSeconds: number;
  totalTimeSeconds: number;
  deltaValueSeconds: number;
  started: boolean;
  finished: boolean;
}
