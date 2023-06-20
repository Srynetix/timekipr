import { DurationModel } from "./DurationModel";

export class Duration {
  private _seconds: number;

  constructor(seconds: number) {
    this._seconds = seconds;
  }

  static fromModel(model: DurationModel): Duration {
    return new Duration(
      (model.seconds || 0) +
        (model.minutes || 0) * 60 +
        (model.hours || 0) * 3600
    );
  }

  get seconds(): number {
    return this._seconds;
  }

  increment() {
    this._seconds++;
  }

  addSeconds(seconds: number) {
    this._seconds += seconds;
  }

  clamp(maxSeconds: number) {
    this._seconds = Math.min(this._seconds, maxSeconds);
  }

  toString() {
    return this._seconds.toString();
  }

  valueOf() {
    return this._seconds.valueOf();
  }

  toHumanReadableString(): string {
    const sign = Math.sign(this._seconds);
    const seconds = Math.abs(this._seconds);

    const secondsAmount = seconds % 60;
    let minutesAmount = Math.floor(seconds / 60.0);
    const hoursAmount = Math.floor(minutesAmount / 60.0);

    minutesAmount %= 60;

    let output = "";

    if (hoursAmount > 0) {
      output += `${hoursAmount}h`;
    }

    if (minutesAmount > 0) {
      output += `${minutesAmount}m`;
    }

    if (secondsAmount > 0 || output === "") {
      output += `${secondsAmount}s`;
    }

    if (sign < 0) {
      output = "-" + output;
    }

    return output;
  }
}
