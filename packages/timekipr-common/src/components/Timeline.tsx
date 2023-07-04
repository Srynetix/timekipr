import { Box, Clock, PlayCircle, RefreshCw, Share2 } from "react-feather";
import { TimeSlot } from "./TimeSlot";
import { Button } from "./Button";
import clsx from "clsx";
import { ChronometerView } from "./ChronometerView";
import { InlineHelp } from "./InlineHelp";
import { SHOW_NOTIFICATIONS } from "../constants";
import { ChronometerTimelineViewDTO } from "../domain/mappers/ChronometerTimelineMapper";

export interface Props {
  timelineView: ChronometerTimelineViewDTO;
  chronometerView: boolean;
  setChronometerView: (value: boolean) => void;
  onPlay: () => void;
  onReset: () => void;
  onCheck: () => void;
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
  timelineView,
  chronometerView,
  setChronometerView,
  onPlay,
  onReset,
  onCheck,
}: Props) => {
  const onLocalPlay = () => {
    if (SHOW_NOTIFICATIONS && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
    onPlay();
  };

  if (chronometerView && timelineView.currentChronometer != null) {
    return (
      <div className="timeline">
        <ChronometerView
          switchToTimeline={() => setChronometerView(false)}
          timelineView={timelineView}
          onCheck={onCheck}
          onPlay={onLocalPlay}
          onReset={onReset}
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
      {timelineView.chronometers.length == 0 && <HelpText />}
      {timelineView.chronometers.length > 0 && (
        <div className="timeline__slots">
          {timelineView.chronometers.map((chronometer, idx) => (
            <TimeSlot key={idx} chronometer={chronometer} onCheck={onCheck} />
          ))}
        </div>
      )}
      {timelineView.started && (
        <div className="timeline__overall-counter">
          <span className="timeline__overall-counter__elapsed">
            {timelineView.totalElapsedTime.humanReadableString}
          </span>
          /
          <span className="timeline__overall-counter__total">
            {timelineView.totalTimeLimit.humanReadableString}
          </span>
          (
          <span
            className={clsx("timeline__overall-counter__delta", {
              "timeline__overall-counter__delta--positive":
                timelineView.totalDeltaValue.seconds > 0,
              "timeline__overall-counter__delta--negative":
                timelineView.totalDeltaValue.seconds <= 0,
            })}
          >
            {timelineView.totalDeltaValue.humanReadableString}
          </span>
          )
        </div>
      )}
      <div className="timeline__buttons">
        {!!timelineView.currentChronometer && (
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
            timelineView.finished ||
            timelineView.started ||
            timelineView.chronometers.length == 0
          }
          onClick={onLocalPlay}
          title="Start timeline"
        >
          <PlayCircle /> Play
        </Button>

        <Button
          primary
          disabled={!timelineView.started}
          onClick={onReset}
          title="Reset timeline"
        >
          <RefreshCw /> Reset
        </Button>
      </div>
    </div>
  );
};
