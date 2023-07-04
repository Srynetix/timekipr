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

export function Ok<T, E>(value: T): Result<T, E> {
  return Result.buildOk(value);
}

export function Err<T, E>(error: E): Result<T, E> {
  return Result.buildErr(error);
}
