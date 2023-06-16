import { ChronometerSnapshot } from "./ChronometerSnapshot";
import { Duration } from "./Duration";
import { DurationModel } from "./DurationModel";

export class Chronometer {
  private _name: string;
  private _elapsedTime: Duration;
  private _timeLimit: Duration;
  private _warnAtPercentage: number;
  private _warnPassed: boolean;
  private _timeOutPassed: boolean;

  onWarn: ((chrono: Chronometer) => void) | null;
  onFinished: ((chrono: Chronometer) => void) | null;

  constructor(
    name: string,
    timeLimit: DurationModel,
    warnAtPercentage: number
  ) {
    this._name = name;
    this._elapsedTime = new Duration(0);
    this._timeLimit = Duration.fromModel(timeLimit);
    this._warnAtPercentage = warnAtPercentage;
    this._warnPassed = false;
    this._timeOutPassed = false;

    this.onWarn = null;
    this.onFinished = null;
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
      finished: this.finished,
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

  get finished(): boolean {
    return +this._timeLimit > 0 && this._elapsedTime >= this._timeLimit;
  }

  get progress(): number {
    return this._timeLimit.seconds > 0
      ? Math.floor((this._elapsedTime.seconds / this._timeLimit.seconds) * 100)
      : 0;
  }

  tick(seconds: number) {
    if (this._elapsedTime < this._timeLimit) {
      this._elapsedTime.addSeconds(seconds);
      this._elapsedTime.clamp(this._timeLimit.seconds);

      if (this.warnPassed()) {
        this.sendWarnNotification();
      }

      if (this.timeOutPassed()) {
        this.sendTimeOutNotification();
      }
    }
  }

  warnPassed(): boolean {
    if (
      !this._warnPassed &&
      this._warnAtPercentage > 0 &&
      this._warnAtPercentage < 100 &&
      this.progress >= this._warnAtPercentage
    ) {
      this._warnPassed = true;
      return true;
    }

    return false;
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

  sendWarnNotification() {
    if (this.onWarn) {
      this.onWarn(this);
    }
  }

  sendTimeOutNotification() {
    if (this.onFinished) {
      this.onFinished(this);
    }
  }
}
