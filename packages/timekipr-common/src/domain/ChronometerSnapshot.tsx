import { ChronometerAlertSnapshot } from "./ChronometerAlertSnapshot";

export interface ChronometerSnapshot {
  name: string;
  elapsedTimeSeconds: number;
  elapsedTimeHumanReadable: string;
  timeLimitHumanReadable: string;
  progress: number;
  started: boolean;
  stopped: boolean;
  timedOut: boolean;
  deltaValueSeconds: number;
  deltaValueHumanReadable: string;
  alerts: ChronometerAlertSnapshot[];
}
