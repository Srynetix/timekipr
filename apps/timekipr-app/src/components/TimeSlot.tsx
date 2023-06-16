import { ChronometerSnapshot } from "../domain/ChronometerSnapshot";

export interface Props {
  chronometer: ChronometerSnapshot;
}

export const TimeSlot = ({ chronometer }: Props) => {
  return (
    <div
      className={`timeslot ${
        chronometer.finished
          ? "timeslot--finished"
          : chronometer.elapsedTimeSeconds > 0
          ? "timeslot--progress"
          : ""
      }`}
    >
      <b>
        {chronometer.name || <i>no name</i>} (
        {chronometer.timeLimitHumanReadable})
      </b>
      <progress value={chronometer.progress} max={100} />
      {chronometer.elapsedTimeHumanReadable} /{" "}
      {chronometer.timeLimitHumanReadable}
    </div>
  );
};
