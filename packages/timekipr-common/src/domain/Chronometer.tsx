import { Duration } from "./value_objects/Duration";
import { ChronometerAlert } from "./ChronometerAlert";
import { Option, None, Some } from "../functional";
import { EventMapper } from "../utils";

export interface ChronometerProps {
  name: string;
  timeLimit: Duration;
  alerts: ChronometerAlert[];
  timeOutPassed: boolean;
  startedAt: Option<Date>;
  finishedAt: Option<Date>;
  lastUpdatedAt: Option<Date>;
}

export type ChronometerOnAlertCallback = (
  chrono: Chronometer,
  remainingSeconds: number
) => void;
export type ChronometerOnFinishedCallback = (chrono: Chronometer) => void;

export class Chronometer {
  private props: ChronometerProps;

  private _onAlert: EventMapper<ChronometerOnAlertCallback>;
  private _onFinished: EventMapper<ChronometerOnFinishedCallback>;

  private constructor(props: ChronometerProps) {
    this.props = props;

    this._onAlert = new EventMapper();
    this._onFinished = new EventMapper();
  }

  connectOnAlert(cb: ChronometerOnAlertCallback) {
    this._onAlert.connect(cb);
  }

  connectOnFinished(cb: ChronometerOnFinishedCallback) {
    this._onFinished.connect(cb);
  }

  static buildDefault(): Chronometer {
    const props: ChronometerProps = {
      name: "Unknown",
      alerts: [],
      finishedAt: None(),
      startedAt: None(),
      lastUpdatedAt: None(),
      timeLimit: Duration.fromSeconds(0),
      timeOutPassed: false,
    };

    return new Chronometer(props);
  }

  static buildFromProps(props: ChronometerProps): Chronometer {
    return new Chronometer(props);
  }

  startChronometer() {
    this.props.startedAt = Some(new Date());
  }

  finish() {
    this.props.finishedAt = Some(new Date());
  }

  get deltaValue(): Duration {
    return this.elapsedTime.getDifference(this.props.timeLimit);
  }

  get timedOut(): boolean {
    return (
      +this.props.timeLimit > 0 && this.elapsedTime >= this.props.timeLimit
    );
  }

  get timeOutPassed(): boolean {
    return this.props.timeOutPassed;
  }

  get alerts(): ChronometerAlert[] {
    return this.props.alerts;
  }

  get startedAt(): Option<Date> {
    return this.props.startedAt;
  }

  get finishedAt(): Option<Date> {
    return this.props.finishedAt;
  }

  get lastUpdatedAt(): Option<Date> {
    return this.props.lastUpdatedAt;
  }

  get name(): string {
    return this.props.name;
  }

  get timeLimit(): Duration {
    return this.props.timeLimit;
  }

  get elapsedTime(): Duration {
    if (this.props.startedAt.isSome()) {
      const startedAt = this.props.startedAt.unwrap();
      if (this.props.lastUpdatedAt.isSome()) {
        const lastUpdated = this.props.lastUpdatedAt.unwrap();
        return Duration.fromDates(startedAt, lastUpdated);
      }
    }

    return Duration.zero();
  }

  get progress(): number {
    return this.props.timeLimit.seconds > 0
      ? Math.floor(
          (this.elapsedTime.milliseconds / this.props.timeLimit.milliseconds) *
            100
        )
      : 0;
  }

  get started(): boolean {
    return this.props.startedAt.isSome();
  }

  get finished(): boolean {
    return this.props.finishedAt.isSome();
  }

  tick(now: Date) {
    if (!this.started || this.finished) {
      return;
    }

    this.props.lastUpdatedAt = Some(now);

    this.processAlerts();
    this.processTimeout();
  }

  processAlerts() {
    const remainingTime =
      this.props.timeLimit.seconds - this.elapsedTime.seconds;

    for (const alert of this.props.alerts) {
      if (!alert.shown && alert.remainingTime.seconds >= remainingTime) {
        alert.setShown(true);

        this._onAlert.send(this, alert.remainingTime.seconds);
      }
    }
  }

  processTimeout() {
    if (
      !this.props.timeOutPassed &&
      this.elapsedTime.seconds >= this.props.timeLimit.seconds
    ) {
      this.props.timeOutPassed = true;
      this._onFinished.send(this);
    }
  }
}
