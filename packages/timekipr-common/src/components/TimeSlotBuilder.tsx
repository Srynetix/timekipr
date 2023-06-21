import { ChronometerTimelineProps } from "../domain/ChronometerTimelineProps";
import { DurationProps } from "../domain/DurationProps";
import { DurationPicker } from "./DurationPicker";
import { AlertBuilder } from "./AlertBuilder";
import { ChronometerAlertProps } from "../domain/ChronometerAlertProps";

export interface Props {
  definition: ChronometerTimelineProps;
  onChange: (definition: ChronometerTimelineProps) => void;
  readonly: boolean;
}

export const TimeSlotBuilder = ({ definition, onChange, readonly }: Props) => {
  const changeField = (
    fieldName: keyof ChronometerTimelineProps,
    fieldValue: string | DurationProps | ChronometerAlertProps[]
  ) => {
    onChange({ ...definition, [fieldName]: fieldValue });
  };

  return (
    <div className="timeslot-builder">
      <div className="timeslot-builder__field timeslot-builder__field--name">
        <label>
          Name
          <input
            type="text"
            disabled={readonly}
            value={definition.name}
            onChange={(e) => changeField("name", e.target.value)}
          />
        </label>
      </div>
      <div className="timeslot-builder__field timeslot-builder__field--timelimit">
        <label>
          Duration
          <DurationPicker
            readonly={readonly}
            value={definition.timeLimit}
            onChange={(v) => changeField("timeLimit", v)}
          />
        </label>
      </div>
      <div className="timeslot-builder__field timeslot-builder__field--alerts">
        <label>
          Alerts
          <AlertBuilder
            alerts={definition.alerts}
            onChange={(alerts) => changeField("alerts", alerts)}
            readonly={readonly}
          />
        </label>
      </div>
    </div>
  );
};
