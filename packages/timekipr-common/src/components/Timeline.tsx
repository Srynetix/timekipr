import { Box, Clock, PlayCircle, RefreshCw, Share2 } from "react-feather";
import { ChronometerTimelineProps } from "../domain/ChronometerTimelineProps";
import { useTimeline } from "../hooks/useTimeline";
import { TimeSlot } from "./TimeSlot";
import { Button } from "./Button";
import clsx from "clsx";
import { ChronometerView } from "./ChronometerView";
import { InlineHelp } from "./InlineHelp";
import { SHOW_NOTIFICATIONS } from "../constants";
import { Duration } from "../domain/Duration";

export interface Props {
  definitions: ChronometerTimelineProps[];
  chronometerView: boolean;
  setChronometerView: (value: boolean) => void;
  onPlay: () => void;
  onReset: () => void;
}

const HelpText = () => (
  <InlineHelp>
    <p>No chronometer set.</p>
    <p>
      Please build your timeline using the{" "}
      <Button inline>
        <Box />
        Timeline Builder
      </Button>{" "}
      section.
    </p>
    <p>
      You can save/load a timeline build using the{" "}
      <Button inline>
        <Share2 />
        Share
      </Button>{" "}
      section.
    </p>
  </InlineHelp>
);

export const Timeline = ({
  definitions,
  chronometerView,
  setChronometerView,
  onPlay,
  onReset,
}: Props) => {
  const {
    startTimeline,
    markCurrentChronometerAsDone,
    resetTimeline: resetTimelineInner,
    timeline,
  } = useTimeline(definitions);

  const onLocalPlay = () => {
    if (SHOW_NOTIFICATIONS && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    startTimeline();
    onPlay();
  };

  const resetTimeline = () => {
    resetTimelineInner();
    onReset();
  };

  if (chronometerView && timeline.currentChronometer != null) {
    return (
      <div className="timeline">
        <ChronometerView
          switchToTimeline={() => setChronometerView(false)}
          timeline={timeline}
          onCheck={() => markCurrentChronometerAsDone()}
          onPlay={onLocalPlay}
          onReset={resetTimeline}
        />
      </div>
    );
  }

  return (
    <div className="timeline">
      <div className="timeline__title">
        <Clock />
        Timeline
      </div>
      {timeline.chronometers.length == 0 && <HelpText />}
      {timeline.chronometers.length > 0 && (
        <div className="timeline__slots">
          {timeline.chronometers.map((chronometer, idx) => (
            <TimeSlot
              key={idx}
              chronometer={chronometer}
              onCheck={() => markCurrentChronometerAsDone()}
            />
          ))}
        </div>
      )}
      {timeline.started && (
        <div className="timeline__overall-counter">
          <span className="timeline__overall-counter__elapsed">
            {Duration.fromSeconds(
              timeline.elapsedTimeSeconds
            ).toHumanReadableString()}
          </span>
          /
          <span className="timeline__overall-counter__total">
            {Duration.fromSeconds(
              timeline.totalTimeSeconds
            ).toHumanReadableString()}
          </span>
          (
          <span
            className={clsx("timeline__overall-counter__delta", {
              "timeline__overall-counter__delta--positive":
                timeline.deltaValueSeconds > 0,
              "timeline__overall-counter__delta--negative":
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
      <div className="timeline__buttons">
        {!!timeline.currentChronometer && (
          <Button
            primary
            onClick={() => setChronometerView(true)}
            title="Show chronometer"
          >
            <Clock /> Show chronometer
          </Button>
        )}
        <Button
          primary
          disabled={
            timeline.finished ||
            timeline.started ||
            timeline.chronometers.length == 0
          }
          onClick={onLocalPlay}
          title="Start timeline"
        >
          <PlayCircle /> Play
        </Button>

        <Button primary onClick={resetTimeline} title="Reset timeline">
          <RefreshCw /> Reset
        </Button>
      </div>
    </div>
  );
};
