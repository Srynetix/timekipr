import { SHOW_NOTIFICATIONS } from "../constants";
import { Chronometer } from "./Chronometer";
import { ChronometerFlowDefinition } from "./ChronometerFlowDefinition";
import { ChronometerSnapshot } from "./ChronometerSnapshot";
import { Duration } from "./Duration";

export class ChronometerFlow {
  private _chronometers: Chronometer[];
  private _currentChronometerIndex: number;
  private _started: boolean;

  constructor(definitions: ChronometerFlowDefinition[]) {
    this._chronometers = definitions.map(
      (d) => new Chronometer(d.name, d.timeLimit, d.alerts)
    );
    this._currentChronometerIndex = 0;
    this._started = false;

    this._chronometers.forEach((c) => {
      c.onFinished = this.sendFinishedNotification.bind(this);
      c.onAlert = this.sendAlertNotification.bind(this);
    });
  }

  sendAlertNotification(chronometer: Chronometer, remainingSeconds: number) {
    if (SHOW_NOTIFICATIONS && Notification.permission == "granted") {
      const remaining = new Duration(remainingSeconds);
      let message = `Only ${remaining.toHumanReadableString()} left for "${
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
    if (SHOW_NOTIFICATIONS && Notification.permission == "granted") {
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

  start() {
    this._started = true;
    this.currentChronometer.start();
  }

  get started(): boolean {
    return this._started;
  }

  get chronometerIndex(): number {
    return this.chronometerIndex;
  }

  get finished(): boolean {
    return (
      this._currentChronometerIndex == this._chronometers.length - 1 &&
      this.currentChronometer.stopped
    );
  }

  get totalTimeLimit(): Duration {
    return new Duration(
      this._chronometers
        .map((c) => c.timeLimit.seconds)
        .reduce((acc, x) => acc + x, 0)
    );
  }

  get totalElapsedTime(): Duration {
    return new Duration(
      this._chronometers
        .map((c) => c.elapsedTime.seconds)
        .reduce((acc, x) => acc + x, 0)
    );
  }

  get deltaValue(): Duration {
    return new Duration(
      this._chronometers
        .map((c) => c.effectiveDeltaValue.seconds)
        .reduce((acc, x) => acc + x, 0)
    );
  }

  tick(seconds: number) {
    if (
      this.finished ||
      this._chronometers.length == 0 ||
      !this.currentChronometer.started
    ) {
      return;
    }

    this.currentChronometer.tick(seconds);

    if (this.finished) {
      return;
    } else if (this.currentChronometer.stopped) {
      // Start next one!
      this._currentChronometerIndex += 1;
      this.currentChronometer.start();
    }
  }
}
