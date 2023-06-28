import { Box, CheckCircle, Clock, PlayCircle, RefreshCw } from "react-feather";
import { Button } from "./Button";
import clsx from "clsx";
import { Duration } from "../domain/value_objects/Duration";
import { ChronometerTimelineViewDTO } from "../domain/mappers/ChronometerTimelineMapper";

export interface Props {
  timelineView: ChronometerTimelineViewDTO;
  switchToTimeline: () => void;
  onCheck: () => void;
  onPlay: () => void;
  onReset: () => void;
}

export const ChronometerView = ({
  switchToTimeline,
  timelineView,
  onCheck,
  onPlay,
  onReset,
}: Props) => {
  const currentChronometer = timelineView.currentChronometer;
  if (currentChronometer == null) {
    return null;
  }

  return (
    <div className="chronometer-view">
      <div className="chronometer-view__title">
        <Clock />
        Chronometer
      </div>
      <div className="chronometer-view__chronometer">
        <div className="chronometer-view__chronometer__name">
          {currentChronometer.name} (
          {Duration.fromProps(
            currentChronometer.timeLimit
          ).toHumanReadableString()}
          )
        </div>
        <div
          className={clsx("chronometer-view__chronometer__time", {
            "chronometer-view__chronometer__time--positive":
              Duration.fromProps(currentChronometer.deltaValue).seconds >= 0,
            "chronometer-view__chronometer__time--negative":
              Duration.fromProps(currentChronometer.deltaValue).seconds < 0,
          })}
        >
          {Duration.fromProps(
            currentChronometer.deltaValue
          ).toHumanReadableString()}
        </div>
        {timelineView.started && (
          <div className="chronometer-view__overall-counter">
            <span className="chronometer-view__overall-counter__elapsed">
              {timelineView.totalElapsedTime.humanReadableString}
            </span>
            /
            <span className="chronometer-view__overall-counter__total">
              {timelineView.totalTimeLimit.humanReadableString}
            </span>
            (
            <span
              className={clsx("chronometer-view__overall-counter__delta", {
                "chronometer-view__overall-counter__delta--positive":
                  timelineView.totalDeltaValue.seconds > 0,
                "chronometer-view__overall-counter__delta--negative":
                  timelineView.totalDeltaValue.seconds <= 0,
              })}
            >
              {timelineView.totalDeltaValue.humanReadableString}
            </span>
            )
          </div>
        )}
        <Button
          primary
          className="chronometer-view__chronometer__check"
          disabled={currentChronometer.finished || !currentChronometer.started}
          onClick={() => onCheck()}
          title="Mark as done"
        >
          <CheckCircle />
        </Button>
      </div>
      <div className="chronometer-view__footer-actions">
        <Button primary onClick={() => switchToTimeline()}>
          <Box />
          Show timeline
        </Button>
        <Button
          primary
          disabled={
            timelineView.finished ||
            timelineView.started ||
            timelineView.chronometers.length == 0
          }
          onClick={onPlay}
          title="Start timeline"
        >
          <PlayCircle /> Play
        </Button>

        <Button primary disabled={!timelineView.started} onClick={onReset} title="Reset timeline">
          <RefreshCw /> Reset
        </Button>
      </div>
    </div>
  );
};
