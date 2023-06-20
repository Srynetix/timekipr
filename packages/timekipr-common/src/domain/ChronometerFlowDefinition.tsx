import { compressToBase64, decompressFromBase64 } from "lz-string";
import { DurationModel } from "./DurationModel";

export interface ChronometerAlertDefinition {
  remainingTime: DurationModel;
}

export interface ChronometerFlowDefinition {
  name: string;
  timeLimit: DurationModel;
  alerts: ChronometerAlertDefinition[];
}

export const buildHash = (definitions: ChronometerFlowDefinition[]): string => {
  return compressToBase64(JSON.stringify(definitions));
};

export const loadHash = (hash: string): ChronometerFlowDefinition[] => {
  if (hash == "") {
    return [];
  }

  return JSON.parse(decompressFromBase64(hash));
};

export const buildDefaultDefinition = (): ChronometerFlowDefinition => {
  return {
    name: "Step",
    timeLimit: { minutes: 5 },
    alerts: [],
  };
};

export const buildDefaultAlertDefinition = (): ChronometerAlertDefinition => {
  return {
    remainingTime: { minutes: 5 },
  };
};
