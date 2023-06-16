import { compressToBase64, decompressFromBase64 } from "lz-string";
import { DurationModel } from "./DurationModel";

export interface ChronometerFlowDefinition {
  name: string;
  timeLimit: DurationModel;
  warnAtPercentage: number;
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
