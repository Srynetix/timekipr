import { ChronometerFlowDefinition } from "../domain/ChronometerFlowDefinition";
import { useFlow } from "../hooks/useFlow";
import { TimeSlot } from "./TimeSlot";

export interface Props {
  definitions: ChronometerFlowDefinition[];
}

export const Timeline = ({ definitions }: Props) => {
  const { setPause, paused, finished, chronometers } = useFlow(definitions);

  const onPlayPause = () => {
    if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    setPause(!paused());
  };

  return (
    <div className="timeline">
      <div className="timeline__title">Timeline</div>
      {chronometers.length == 0 ? (
        <i>No chronometer set.</i>
      ) : (
        chronometers.map((chronometer, idx) => (
          <TimeSlot key={idx} chronometer={chronometer} />
        ))
      )}
      <button
        disabled={finished() || chronometers.length == 0}
        onClick={onPlayPause}
      >
        {paused() ? "Play" : "Pause"}
      </button>
    </div>
  );
};
