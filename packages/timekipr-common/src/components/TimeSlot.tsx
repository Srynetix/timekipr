import { AlertCircle, CheckCircle } from "react-feather";
import clsx from "clsx";
import { Button } from "./Button";
import { immutableArraySort } from "../utils";
import { Duration } from "../domain/value_objects/Duration";
import { ChronometerViewDTO } from "../domain/mappers/ChronometerMapper";

export interface Props {
  chronometer: ChronometerViewDTO;
  onCheck: () => void;
}

export const TimeSlot = ({ chronometer, onCheck }: Props) => {
  return (
    <div
      className={`timeslot ${
        chronometer.finished
          ? "timeslot--finished"
          : Duration.fromProps(chronometer.elapsedTime).seconds > 0
          ? "timeslot--progress"
          : ""
      }`}
    >
      <div className="timeslot__title">
        <div className="timeslot__title__header" title={chronometer.name}>
          {chronometer.name || <i>no name</i>}
        </div>
        <div className="timeslot__title__time-limit">
          ({Duration.fromProps(chronometer.timeLimit).toHumanReadableString()})
        </div>
      </div>
      <div className="timeslot__progress">
        <progress
          className="timeslot__progress__bar"
          value={chronometer.progressPercentage}
          max={100}
        />
        <div className="timeslot__progress__alerts">
          {immutableArraySort(
            chronometer.alerts,
            (a, b) =>
              Duration.fromProps(b.remainingTime).seconds -
              Duration.fromProps(a.remainingTime).seconds
          ).map((a) => (
            <div
              key={Duration.fromProps(a.remainingTime).seconds}
              className={clsx("timeslot__progress__alerts__alert", {
                "timeslot__progress__alerts__alert--shown": a.shown,
              })}
              title={Duration.fromProps(
                a.remainingTime
              ).toHumanReadableString()}
            >
              <AlertCircle />
            </div>
          ))}
        </div>
      </div>
      <div
        className={clsx("timeslot__delta-value", {
          "timeslot__delta-value--positive":
            Duration.fromProps(chronometer.deltaValue).seconds > 0,
          "timeslot__delta-value--negative":
            Duration.fromProps(chronometer.deltaValue).seconds <= 0,
        })}
      >
        {Duration.fromProps(chronometer.elapsedTime).seconds > 0
          ? Duration.fromProps(chronometer.elapsedTime).toHumanReadableString()
          : "--"}
      </div>
      <Button
        primary
        className="timeslot__check"
        disabled={chronometer.finished || !chronometer.started}
        onClick={() => onCheck()}
        title="Mark as done"
      >
        <CheckCircle />
      </Button>
    </div>
  );
};
