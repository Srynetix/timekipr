import { AlertCircle, CheckCircle } from "react-feather";
import { ChronometerSnapshot } from "../domain/ChronometerSnapshot";
import clsx from "clsx";
import { Button } from "./Button";
import { immutableArraySort } from "../utils";
import { Duration } from "../domain/Duration";

export interface Props {
  chronometer: ChronometerSnapshot;
  onCheck: () => void;
}

export const TimeSlot = ({ chronometer, onCheck }: Props) => {
  return (
    <div
      className={`timeslot ${
        chronometer.stopped
          ? "timeslot--finished"
          : chronometer.elapsedTimeSeconds > 0
          ? "timeslot--progress"
          : ""
      }`}
    >
      <div className="timeslot__title">
        <div className="timeslot__title__header" title={chronometer.name}>
          {chronometer.name || <i>no name</i>}
        </div>
        <div className="timeslot__title__time-limit">
          ({chronometer.timeLimitHumanReadable})
        </div>
      </div>
      <div className="timeslot__progress">
        <progress
          className="timeslot__progress__bar"
          value={chronometer.progress}
          max={100}
        />
        <div className="timeslot__progress__alerts">
          {immutableArraySort(
            chronometer.alerts,
            (a, b) => b.remainingTimeSeconds - a.remainingTimeSeconds
          ).map((a) => (
            <div
              key={a.remainingTimeSeconds}
              className={clsx("timeslot__progress__alerts__alert", {
                "timeslot__progress__alerts__alert--shown": a.shown,
              })}
              title={Duration.fromSeconds(
                a.remainingTimeSeconds
              ).toHumanReadableString()}
            >
              <AlertCircle />
            </div>
          ))}
        </div>
      </div>
      <div
        className={clsx("timeslot__delta-value", {
          "timeslot__delta-value--positive": chronometer.deltaValueSeconds > 0,
          "timeslot__delta-value--negative": chronometer.deltaValueSeconds <= 0,
        })}
      >
        {chronometer.elapsedTimeSeconds > 0
          ? chronometer.elapsedTimeHumanReadable
          : "--"}
      </div>
      <Button
        primary
        className="timeslot__check"
        disabled={chronometer.stopped || !chronometer.started}
        onClick={() => onCheck()}
        title="Mark as done"
      >
        <CheckCircle />
      </Button>
    </div>
  );
};
