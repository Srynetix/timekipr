export function immutableArrayInsert<T>(
  array: Array<T>,
  index: number,
  element: T
): Array<T> {
  return [...array.slice(0, index), element, ...array.slice(index + 1)];
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
