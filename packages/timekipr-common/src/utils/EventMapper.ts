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
