import { Box, CheckCircle } from "react-feather";
import { Button } from "./Button";
import { ChronometerSnapshot } from "../domain/ChronometerSnapshot";

export interface Props {
  chronometer: ChronometerSnapshot;
  switchToTimeline: () => void;
  onCheck: () => void;
}

export const ChronometerView = ({
  switchToTimeline,
  chronometer,
  onCheck,
}: Props) => {
  return (
    <div className="chronometer-view">
      <div className="chronometer-view__chronometer">
        <div className="chronometer-view__chronometer__name">
          {chronometer.name} ({chronometer.timeLimitHumanReadable})
        </div>
        <div className="chronometer-view__chronometer__time">
          {chronometer.deltaValueHumanReadable}
        </div>
        <Button
          primary
          className="chronometer-view__chronometer__check"
          disabled={chronometer.stopped || !chronometer.started}
          onClick={() => onCheck()}
          title="Mark as done"
        >
          <CheckCircle />
        </Button>
      </div>
      <Button primary onClick={() => switchToTimeline()}>
        <Box />
        Show timeline
      </Button>
    </div>
  );
};
