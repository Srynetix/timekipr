import { ChronometerFlowDefinition } from "../domain/ChronometerFlowDefinition";
import { DurationModel } from "../domain/DurationModel";
import { DurationPicker } from "./DurationPicker";

export interface Props {
  definition: ChronometerFlowDefinition;
  onChange: (definition: ChronometerFlowDefinition) => void;
}

export const TimeSlotBuilder = ({ definition, onChange }: Props) => {
  const changeField = (
    fieldName: keyof ChronometerFlowDefinition,
    fieldValue: string | DurationModel
  ) => {
    onChange({ ...definition, [fieldName]: fieldValue });
  };

  return (
    <div className="timeslot-builder">
      <div className="timeslot-builder__field timeslot-builder__field--name">
        <label>Name</label>
        <input
          type="text"
          value={definition.name}
          onChange={(e) => changeField("name", e.target.value)}
        />
      </div>
      <div className="timeslot-builder__field timeslot-builder__field--timelimit">
        <label>Duration</label>
        <DurationPicker
          value={definition.timeLimit}
          onChange={(v) => changeField("timeLimit", v)}
        />
      </div>
      <div className="timeslot-builder__field timeslot-builder__field--percentage">
        <label>Warn at percentage</label>
        <input
          type="number"
          min="0"
          max="100"
          value={definition.warnAtPercentage}
          onChange={(e) => changeField("warnAtPercentage", e.target.value)}
        />
        <label>%</label>
      </div>
    </div>
  );
};
