export interface ChronometerSnapshot {
  name: string;
  elapsedTimeSeconds: number;
  elapsedTimeHumanReadable: string;
  timeLimitHumanReadable: string;
  progress: number;
  finished: boolean;
}
