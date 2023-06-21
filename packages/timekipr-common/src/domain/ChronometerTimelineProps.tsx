import { compressToBase64, decompressFromBase64 } from "lz-string";
import { DurationProps } from "./DurationProps";
import { ChronometerAlertProps } from "./ChronometerAlertProps";

export interface ChronometerTimelineProps {
  name: string;
  timeLimit: DurationProps;
  alerts: ChronometerAlertProps[];
}

export const buildHash = (definitions: ChronometerTimelineProps[]): string => {
  return compressToBase64(JSON.stringify(definitions));
};

export const loadHash = (hash: string): ChronometerTimelineProps[] => {
  if (hash == "") {
    return [];
  }

  return JSON.parse(decompressFromBase64(hash));
};

export const buildDefaultDefinition = (): ChronometerTimelineProps => {
  return {
    name: "Step",
    timeLimit: { minutes: 5 },
    alerts: [],
  };
};

export const buildDefaultAlertDefinition = (): ChronometerAlertProps => {
  return {
    remainingTime: { minutes: 5 },
  };
};
