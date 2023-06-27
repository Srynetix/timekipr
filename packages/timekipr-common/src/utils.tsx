import { compressToBase64, decompressFromBase64 } from "lz-string";

export function immutableArrayInsert<T>(
  array: Array<T>,
  index: number,
  element: T
): Array<T> {
  return [...array.slice(0, index), element, ...array.slice(index + 1)];
}

export function immutableArrayInsertN<T>(
  array: Array<T>,
  index: number,
  elements: T[]
): Array<T> {
  return [...array.slice(0, index), ...elements, ...array.slice(index + elements.length)];
}

export function immutableArrayRemove<T>(
  array: Array<T>,
  index: number
): Array<T> {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}

export function immutableArrayMoveIndex<T>(
  array: Array<T>,
  index: number,
  target: number
): Array<T> {
  const cloned = [...array];
  cloned.splice(target, 0, cloned.splice(index, 1)[0]);
  return cloned;
}

export function immutableArraySort<T>(
  array: Array<T>,
  sortFn: (a: T, b: T) => number
): Array<T> {
  return [...array].sort(sortFn);
}

export function buildHash<T>(obj: T): string {
  return compressToBase64(JSON.stringify(obj));
}

export function loadHash<T>(hash: string): T | null {
  if (hash == "") {
    return null;
  }

  return JSON.parse(decompressFromBase64(hash));
}

// eslint-disable-next-line @typescript-eslint/ban-types
export class EventMapper<T extends Function> {
  private _callbacks: T[];

  constructor() {
    this._callbacks = [];
  }

  connect(callback: T) {
    const idx = this._callbacks.findIndex((v) => v == callback);
    if (idx == -1) {
      this._callbacks.push(callback);
    }
  }

  disconnect(callback: T) {
    const idx = this._callbacks.findIndex((v) => v == callback);
    if (idx >= 0) {
      this._callbacks.splice(idx, 1);
    }
  }

  send(...args: unknown[]) {
    for (const cb of this._callbacks) {
      cb(...args);
    }
  }
}
