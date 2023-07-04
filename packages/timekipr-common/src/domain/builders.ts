import { ChronometerAlertDefinition } from "./mappers/ChronometerAlertMapper";
import { ChronometerDefinition } from "./mappers/ChronometerMapper";
import { ChronometerTimelineDefinition } from "./mappers/ChronometerTimelineMapper";

export const buildDefaultTimelineDefinition =
  (): ChronometerTimelineDefinition => {
    return {
      chronometers: [],
    };
  };

export const buildDefaultChronometerDefinition = (): ChronometerDefinition => {
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
