import {
  ChronometerAlertDefinition,
  ChronometerFlowDefinition,
} from "../domain/ChronometerFlowDefinition";
import { DurationModel } from "../domain/DurationModel";
import { DurationPicker } from "./DurationPicker";
import { AlertBuilder } from "./AlertBuilder";

export interface Props {
  definition: ChronometerFlowDefinition;
  onChange: (definition: ChronometerFlowDefinition) => void;
  readonly: boolean;
}

export const TimeSlotBuilder = ({ definition, onChange, readonly }: Props) => {
  const changeField = (
    fieldName: keyof ChronometerFlowDefinition,
    fieldValue: string | DurationModel | ChronometerAlertDefinition[]
  ) => {
    console.log(fieldName, fieldValue);
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
