import { Duration, DurationProps } from "../../domain/value_objects/Duration";

export interface Props {
  value: DurationProps;
  onChange: (value: DurationProps) => void;
  readonly: boolean;
}

export const DurationPicker = ({ value, onChange, readonly }: Props) => {
  const changeField = (fieldName: keyof DurationProps, fieldValue: string) => {
    if (fieldValue !== "") {
      onChange({ ...value, [fieldName]: parseInt(fieldValue) });
    } else {
      const { [fieldName]: _, ...rest } = value;
      onChange(rest);
    }
  };

  const numberOrSpace = (num: number | undefined): string => {
    if (num == undefined) {
      return "";
    } else {
      return num.toString();
    }
  };

  return (
    <div
      className="duration-picker"
      title={Duration.fromProps(value).toHumanReadableString()}
    >
      <div className="duration-picker__field">
        <input
          type="number"
          min="0"
          disabled={readonly}
          value={numberOrSpace(value.hours)}
          onChange={(v) => changeField("hours", v.target.value)}
        />
        <label>h</label>
      </div>
      <div className="duration-picker__field">
        <input
          type="number"
          min="0"
          disabled={readonly}
          value={numberOrSpace(value.minutes)}
          onChange={(v) => changeField("minutes", v.target.value)}
        />
        <label>m</label>
      </div>
      <div className="duration-picker__field">
        <input
          type="number"
          min="0"
          disabled={readonly}
          value={numberOrSpace(value.seconds)}
          onChange={(v) => changeField("seconds", v.target.value)}
        />
        <label>s</label>
      </div>
    </div>
  );
};
