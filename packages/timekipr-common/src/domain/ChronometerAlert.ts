import { Duration } from "./value_objects/Duration";

export interface ChronometerAlertProps {
  remainingTime: Duration;
  shown: boolean;
}

export class ChronometerAlert {
  private props: ChronometerAlertProps;

  private constructor(props: ChronometerAlertProps) {
    this.props = props;
  }

  static buildDefault(): ChronometerAlert {
    return new ChronometerAlert({
      remainingTime: Duration.fromSeconds(0),
      shown: false,
    });
  }

  static buildFromProps(props: ChronometerAlertProps): ChronometerAlert {
    return new ChronometerAlert(props);
  }

  get shown(): boolean {
    return this.props.shown;
  }

  get remainingTime(): Duration {
    return this.props.remainingTime;
  }

  setShown(value: boolean) {
    this.props.shown = value;
  }
}
