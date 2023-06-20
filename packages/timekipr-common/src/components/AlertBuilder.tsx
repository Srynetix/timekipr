import { Plus, Trash } from "react-feather";
import {
  ChronometerAlertDefinition,
  buildDefaultAlertDefinition,
} from "../domain/ChronometerFlowDefinition";
import { Button } from "./Button";
import { DurationPicker } from "./DurationPicker";

export interface Props {
  alerts: ChronometerAlertDefinition[];
  onChange: (alerts: ChronometerAlertDefinition[]) => void;
  readonly: boolean;
}

export const AlertBuilder = ({ alerts, onChange, readonly }: Props) => {
  const updateAlerts = (index: number, value: ChronometerAlertDefinition) => {
    onChange([...alerts.slice(0, index), value, ...alerts.slice(index + 1)]);
  };

  const removeAlert = (index: number) => {
    onChange([...alerts.slice(0, index), ...alerts.slice(index + 1)]);
  };

  return (
    <div className="alert-builder">
      {alerts.map((alert, idx) => (
        <div className="alert-builder__entry" key={idx}>
          <DurationPicker
            onChange={(value) =>
              updateAlerts(idx, { ...alert, remainingTime: value })
            }
            readonly={readonly}
            value={alert.remainingTime}
          />
          <Button
            primary
            disabled={readonly}
            onClick={(e) => {
              removeAlert(idx);
              e.preventDefault();
            }}
          >
            <Trash />
          </Button>
        </div>
      ))}
      <Button
        primary
        disabled={readonly}
        onClick={() => onChange([...alerts, buildDefaultAlertDefinition()])}
      >
        <Plus />
        Add
      </Button>
    </div>
  );
};
