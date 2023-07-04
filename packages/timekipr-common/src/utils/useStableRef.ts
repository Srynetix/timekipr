import { useRef } from "react";

const uninitializedRef = Symbol("uninitialized");

export function useStableRef<T>(fn: () => T): React.MutableRefObject<T> {
  const ref = useRef<T>(uninitializedRef as unknown as T);
  if (ref.current === uninitializedRef) {
    ref.current = fn();
  }
  return ref;
}
