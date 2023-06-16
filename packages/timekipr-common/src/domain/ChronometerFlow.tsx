import { Chronometer } from "./Chronometer";
import { ChronometerFlowDefinition } from "./ChronometerFlowDefinition";
import { ChronometerSnapshot } from "./ChronometerSnapshot";
import { Duration } from "./Duration";

export class ChronometerFlow {
  private _chronometers: Chronometer[];
  private _currentChronometerIndex: number;
  private _paused: boolean;

  constructor(definitions: ChronometerFlowDefinition[]) {
    this._chronometers = definitions.map(
      (d) => new Chronometer(d.name, d.timeLimit, d.warnAtPercentage)
    );
    this._currentChronometerIndex = 0;
    this._paused = true;

    this._chronometers.forEach((c) => {
      c.onFinished = this.sendFinishedNotification.bind(this);
      c.onWarn = this.sendWarnNotification.bind(this);
    });
  }

  sendWarnNotification(chronometer: Chronometer) {
    if (Notification.permission == "granted") {
      const remainingSeconds = new Duration(
        chronometer.timeLimit.seconds - chronometer.elapsedTime.seconds
      );
      let message = `Only ${remainingSeconds.toHumanReadableString()} left for "${
        chronometer.name
      }"`;

      if (this._currentChronometerIndex + 1 != this._chronometers.length) {
        message += `, next "${
          this._chronometers[this._currentChronometerIndex + 1].name
        }"`;
      }

      new Notification(message);
    }
  }

  sendFinishedNotification(chronometer: Chronometer) {
    if (Notification.permission == "granted") {
      let message = `Time's up! "${chronometer.name}" ended`;

      if (this._currentChronometerIndex + 1 != this._chronometers.length) {
        message += `, next "${
          this._chronometers[this._currentChronometerIndex + 1].name
        }"`;
      }

      new Notification(message);
    }
  }

  snapshot(): ChronometerSnapshot[] {
    return this._chronometers.map((c) => c.snapshot());
  }

  get chronometers(): Chronometer[] {
    return this._chronometers;
  }

  get currentChronometer(): Chronometer {
    return this._chronometers[this._currentChronometerIndex];
  }

  get paused(): boolean {
    return this._paused;
  }

  setPause(value: boolean) {
    this._paused = value;
  }

  get chronometerIndex(): number {
    return this.chronometerIndex;
  }

  get finished(): boolean {
    return (
      this._currentChronometerIndex == this._chronometers.length - 1 &&
      this.currentChronometer.finished
    );
  }

  tick(seconds: number) {
    if (this.finished || this._paused) {
      return;
    }

    const diffSeconds =
      this.currentChronometer.timeLimit.seconds -
      this.currentChronometer.elapsedTime.seconds;
    const secondsToAdd = Math.min(seconds, diffSeconds);
    const remainingSeconds = seconds - secondsToAdd;

    this.currentChronometer.tick(secondsToAdd);

    if (this.finished) {
      return;
    } else if (this.currentChronometer.finished) {
      this._currentChronometerIndex += 1;
    }

    if (remainingSeconds > 0) {
      this.tick(remainingSeconds);
    }
  }
}
