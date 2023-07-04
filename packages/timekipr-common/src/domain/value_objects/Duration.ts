export interface DurationProps {
  hours?: number;
  minutes?: number;
  seconds?: number;
}

export interface DurationViewDTO {
  milliseconds: number;
  seconds: number;
  humanReadableString: string;
}

export interface DurationStorageDTO {
  milliseconds: number;
}

export class Duration {
  private _milliseconds: number;

  private constructor(milliseconds: number) {
    this._milliseconds = milliseconds;
  }

  static zero(): Duration {
    return new Duration(0);
  }

  static fromDates(from: Date, to: Date): Duration {
    return new Duration(to.valueOf() - from.valueOf());
  }

  static fromSeconds(seconds: number): Duration {
    return new Duration(seconds * 1000);
  }

  static fromMilliseconds(ms: number): Duration {
    return new Duration(ms);
  }

  static fromProps(model: DurationProps): Duration {
    return Duration.fromSeconds(
      (model.seconds || 0) +
        (model.minutes || 0) * 60 +
        (model.hours || 0) * 3600
    );
  }

  get milliseconds(): number {
    return this._milliseconds;
  }

  get seconds(): number {
    return Math.round(this._milliseconds / 1000);
  }

  getDifference(other: Duration): Duration {
    return new Duration(this._milliseconds - other._milliseconds);
  }

  addMilliseconds(ms: number) {
    this._milliseconds += ms;
  }

  toString() {
    return this._milliseconds.toString();
  }

  toViewDTO(): DurationViewDTO {
    return {
      milliseconds: this._milliseconds,
      seconds: this.seconds,
      humanReadableString: this.toHumanReadableString(),
    };
  }

  valueOf() {
    return this._milliseconds.valueOf();
  }

  toHumanReadableString(): string {
    const sign = Math.sign(this.seconds);
    const seconds = Math.abs(this.seconds);

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

  toProps(): DurationProps {
    const hours = Math.floor(this.seconds / 3600);
    const remainingHoursSeconds = hours % 3600;
    const minutes = Math.floor(remainingHoursSeconds / 60);
    const seconds = minutes % 60;

    return {
      hours,
      minutes,
      seconds,
    };
  }
}
