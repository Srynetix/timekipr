export class Option<T> {
  private _value: T | null;

  private constructor(value: T | null) {
    this._value = value;
  }

  static buildSome<U>(value: U): Option<U> {
    return new Option(value);
  }

  static buildNone<U>(): Option<U> {
    return new Option<U>(null);
  }

  static fromNullable<U>(value: U | null): Option<U> {
    if (value == null) {
      return Option.buildNone();
    } else {
      return Option.buildSome(value);
    }
  }

  isSome(): boolean {
    return this._value != null;
  }

  isNone(): boolean {
    return !this.isSome();
  }

  unwrap(): T {
    if (this._value == null) {
      throw new Error("Could not unwrap empty option");
    }

    return this._value;
  }

  unwrapOrElse(fn: () => T): T {
    if (this._value == null) {
      return fn();
    } else {
      return this._value;
    }
  }

  map<U>(fn: (value: T) => U): Option<U> {
    if (this._value != null) {
      return new Option<U>(fn(this._value));
    } else {
      return new Option<U>(null);
    }
  }

  orElse(fn: () => Option<T>): Option<T> {
    if (this._value == null) {
      return fn();
    } else {
      return this;
    }
  }

  toNullable(): T | null {
    return this._value;
  }
}

export function None<T>(): Option<T> {
  return Option.buildNone();
}

export function Some<T>(value: T): Option<T> {
  return Option.buildSome(value);
}
