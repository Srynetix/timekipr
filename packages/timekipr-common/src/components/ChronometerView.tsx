import {
  AlertCircle,
  Box,
  CheckCircle,
  PlayCircle,
  RefreshCw,
} from "react-feather";
import { Button } from "./Button";
import clsx from "clsx";
import { ChronometerTimelineSnapshot } from "../domain/ChronometerTimelineSnapshot";
import { immutableArraySort } from "../utils";
import { Duration } from "../domain/Duration";

export interface Props {
  timeline: ChronometerTimelineSnapshot;
  switchToTimeline: () => void;
  onCheck: () => void;
  onPlay: () => void;
  onReset: () => void;
}

export const ChronometerView = ({
  switchToTimeline,
  timeline,
  onCheck,
  onPlay,
  onReset,
}: Props) => {
  const currentChronometer = timeline.currentChronometer;
  if (currentChronometer == null) {
    return null;
  }

  return (
    <div className="chronometer-view">
      <div className="chronometer-view__chronometer">
        <div className="chronometer-view__chronometer__name">
          {currentChronometer.name} ({currentChronometer.timeLimitHumanReadable}
          )
        </div>
        <div
          className={clsx("chronometer-view__chronometer__time", {
            "chronometer-view__chronometer__time--positive":
              currentChronometer.deltaValueSeconds >= 0,
            "chronometer-view__chronometer__time--negative":
              currentChronometer.deltaValueSeconds < 0,
          })}
        >
          {currentChronometer.deltaValueHumanReadable}
        </div>
        {timeline.started && (
          <div className="chronometer-view__overall-counter">
            <span className="chronometer-view__overall-counter__elapsed">
              {Duration.fromSeconds(
                timeline.elapsedTimeSeconds
              ).toHumanReadableString()}
            </span>
            /
            <span className="chronometer-view__overall-counter__total">
              {Duration.fromSeconds(
                timeline.totalTimeSeconds
              ).toHumanReadableString()}
            </span>
            (
            <span
              className={clsx("chronometer-view__overall-counter__delta", {
                "chronometer-view__overall-counter__delta--positive":
                  timeline.deltaValueSeconds > 0,
                "chronometer-view__overall-counter__delta--negative":
                  timeline.deltaValueSeconds <= 0,
              })}
            >
              {Duration.fromSeconds(
                timeline.deltaValueSeconds
              ).toHumanReadableString()}
            </span>
            )
          </div>
        )}
        <Button
          primary
          className="chronometer-view__chronometer__check"
          disabled={currentChronometer.stopped || !currentChronometer.started}
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
            timeline.finished ||
            timeline.started ||
            timeline.chronometers.length == 0
          }
          onClick={onPlay}
          title="Start timeline"
        >
          <PlayCircle /> Play
        </Button>

        <Button primary onClick={onReset} title="Reset timeline">
          <RefreshCw /> Reset
        </Button>
      </div>
    </div>
  );
};
