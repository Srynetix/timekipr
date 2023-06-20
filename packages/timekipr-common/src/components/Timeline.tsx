import { Box, Clock, PlayCircle, RefreshCw, Share2 } from "react-feather";
import { ChronometerFlowDefinition } from "../domain/ChronometerFlowDefinition";
import { useFlow } from "../hooks/useFlow";
import { TimeSlot } from "./TimeSlot";
import { Button } from "./Button";
import clsx from "clsx";
import { ChronometerView } from "./ChronometerView";
import { InlineHelp } from "./InlineHelp";
import { SHOW_NOTIFICATIONS } from "../constants";

export interface Props {
  definitions: ChronometerFlowDefinition[];
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
    startFlow,
    started,
    finished,
    validateChronometer,
    resetFlow,
    currentChronometer,
    flowDeltaValue,
    flowDeltaValueHumanReadable,
    flowElapsedTime,
    flowTotalTime,
    chronometers,
  } = useFlow(definitions);

  const onLocalPlay = () => {
    if (SHOW_NOTIFICATIONS && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    startFlow();
    onPlay();
  };

  const resetTimeline = () => {
    resetFlow();
    onReset();
  };

  const currentChronometerValue = currentChronometer();

  if (chronometerView && currentChronometerValue != null) {
    return (
      <div className="timeline">
        <ChronometerView
          switchToTimeline={() => setChronometerView(false)}
          chronometer={currentChronometerValue}
          onCheck={() => validateChronometer()}
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
      {chronometers.length == 0 && <HelpText />}
      {chronometers.length > 0 && (
        <div className="timeline__slots">
          {chronometers.map((chronometer, idx) => (
            <TimeSlot
              key={idx}
              chronometer={chronometer}
              onCheck={() => validateChronometer()}
            />
          ))}
        </div>
      )}
      {started() && (
        <div className="timeline__overall-counter">
          <span className="timeline__overall-counter__elapsed">
            {flowElapsedTime}
          </span>
          /
          <span className="timeline__overall-counter__total">
            {flowTotalTime}
          </span>
          (
          <span
            className={clsx("timeline__overall-counter__delta", {
              "timeline__overall-counter__delta--positive": flowDeltaValue > 0,
              "timeline__overall-counter__delta--negative": flowDeltaValue <= 0,
            })}
          >
            {flowDeltaValueHumanReadable}
          </span>
          )
        </div>
      )}
      <div className="timeline__buttons">
        <Button
          primary
          disabled={finished() || started() || chronometers.length == 0}
          onClick={onLocalPlay}
          title="Start timeline"
        >
          <PlayCircle /> Play
        </Button>
        {!!currentChronometerValue && (
          <Button
            primary
            onClick={() => setChronometerView(true)}
            title="Show chronometer"
          >
            <Clock /> Show chronometer
          </Button>
        )}
        <Button primary onClick={resetTimeline} title="Reset timeline">
          <RefreshCw /> Reset
        </Button>
      </div>
    </div>
  );
};
