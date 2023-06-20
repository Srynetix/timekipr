import { ChronometerAlertDefinition } from "./ChronometerFlowDefinition";
import { ChronometerSnapshot } from "./ChronometerSnapshot";
import { Duration } from "./Duration";
import { DurationModel } from "./DurationModel";

export interface ChronometerAlert {
  remainingTime: Duration;
  shown: boolean;
}

export class Chronometer {
  private _name: string;
  private _elapsedTime: Duration;
  private _timeLimit: Duration;
  private _alerts: ChronometerAlert[];
  private _timeOutPassed: boolean;
  private _startedAt: Date | null;
  private _finishedAt: Date | null;

  onAlert: ((chrono: Chronometer, remainingSeconds: number) => void) | null;
  onFinished: ((chrono: Chronometer) => void) | null;

  constructor(
    name: string,
    timeLimit: DurationModel,
    alerts: ChronometerAlertDefinition[]
  ) {
    this._name = name;
    this._elapsedTime = new Duration(0);
    this._timeLimit = Duration.fromModel(timeLimit);
    this._timeOutPassed = false;
    this._startedAt = null;
    this._finishedAt = null;
    this._alerts = alerts.map((d) => ({
      remainingTime: Duration.fromModel(d.remainingTime),
      shown: false,
    }));

    this.onAlert = null;
    this.onFinished = null;
  }

  start() {
    this._startedAt = new Date();
  }

  finish() {
    this._finishedAt = new Date();
  }

  get effectiveDeltaValue(): Duration {
    if (!this.stopped && !this.timedOut) {
      return new Duration(0);
    }

    return this.deltaValue;
  }

  get deltaValue(): Duration {
    return new Duration(+this._elapsedTime - +this._timeLimit);
  }

  get timedOut(): boolean {
    return +this._timeLimit > 0 && this._elapsedTime >= this._timeLimit;
  }

  snapshot(): ChronometerSnapshot {
    return {
      name: this._name,
      elapsedTimeSeconds: this._elapsedTime.seconds,
      elapsedTimeHumanReadable: this._elapsedTime.toHumanReadableString(),
      timeLimitHumanReadable: this._timeLimit.toHumanReadableString(),
      progress:
        this._timeLimit.seconds > 0
          ? Math.floor(
              (this._elapsedTime.seconds / this._timeLimit.seconds) * 100
            )
          : 0,
      started: this.started,
      stopped: this.stopped,
      deltaValueSeconds: this.deltaValue.seconds,
      timedOut: this.timedOut,
      deltaValueHumanReadable: this.deltaValue.toHumanReadableString(),
      alerts: this._alerts.map((a) => ({
        remainingTimeSeconds: a.remainingTime.seconds,
        shown: a.shown,
      })),
    };
  }

  get name(): string {
    return this._name;
  }

  get timeLimit(): Duration {
    return this._timeLimit;
  }

  get elapsedTime(): Duration {
    return this._elapsedTime;
  }

  get progress(): number {
    return this._timeLimit.seconds > 0
      ? Math.floor((this._elapsedTime.seconds / this._timeLimit.seconds) * 100)
      : 0;
  }

  get started(): boolean {
    return this._startedAt != null;
  }

  get stopped(): boolean {
    return this._finishedAt != null;
  }

  tick(seconds: number) {
    if (!this.started || this.stopped) {
      return;
    }

    this._elapsedTime.addSeconds(seconds);

    this.processAlerts();

    if (this.timeOutPassed()) {
      this.sendTimeOutNotification();
    }
  }

  processAlerts() {
    const remainingTime = this._timeLimit.seconds - this._elapsedTime.seconds;

    for (const alert of this._alerts) {
      if (!alert.shown && alert.remainingTime.seconds >= remainingTime) {
        alert.shown = true;

        if (this.onAlert) {
          this.onAlert(this, alert.remainingTime.seconds);
        }
      }
    }
  }

  timeOutPassed(): boolean {
    if (
      !this._timeOutPassed &&
      this._elapsedTime.seconds == this._timeLimit.seconds
    ) {
      this._timeOutPassed = true;
      return true;
    }

    return false;
  }

  sendTimeOutNotification() {
    if (this.onFinished) {
      this.onFinished(this);
    }
  }
}
