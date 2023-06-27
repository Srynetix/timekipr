import { useRef } from "react";

export function None<T>(): Option<T> {
  return Option.buildNone();
}

export function Some<T>(value: T): Option<T> {
  return Option.buildSome(value);
}

export function Ok<T, E>(value: T): Result<T, E> {
  return Result.buildOk(value);
}

export function Err<T, E>(error: E): Result<T, E> {
  return Result.buildErr(error);
}

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

  orElse(fn: () => T): Option<T> {
    if (this._value == null) {
      return new Option<T>(fn());
    } else {
      return this;
    }
  }

  toNullable(): T | null {
    return this._value;
  }
}

export class Result<T, E> {
  private _value: T | null;
  private _error: E | null;
  private _isError: boolean;

  private constructor() {
    this._value = null;
    this._error = null;
    this._isError = false;
  }

  static buildOk<U, F>(value: U): Result<U, F> {
    const result = new Result<U, F>();
    result._value = value;
    result._isError = false;
    return result;
  }

  static buildErr<U, F>(error: F): Result<U, F> {
    const result = new Result<U, F>();
    result._error = error;
    result._isError = true;
    return result;
  }

  unwrap(): T {
    if (this._isError) {
      throw new Error("Could not unwrap failing result");
    }

    return this._value as T;
  }

  unwrapErr(): E {
    if (!this._isError) {
      throw new Error("Could not unwrap error of a success result");
    }

    return this._error as E;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this._isError) {
      return Result.buildErr<U, E>(this._error as E);
    }

    return Result.buildOk(fn(this._value as T));
  }

  isErr(): boolean {
    return this._isError;
  }

  isOk(): boolean {
    return !this._isError;
  }
}

const uninitializedRef = Symbol("uninitialized");
export function useStableRef<T>(fn: () => T): React.MutableRefObject<T> {
  const ref = useRef<T>(uninitializedRef as unknown as T);
  if (ref.current === uninitializedRef) {
    ref.current = fn();
  }
  return ref;
}
