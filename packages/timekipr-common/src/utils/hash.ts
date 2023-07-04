import { compressToBase64, decompressFromBase64 } from "lz-string";

export function buildHash<T>(obj: T): string {
  return compressToBase64(JSON.stringify(obj));
}

export function loadHash<T>(hash: string): T | null {
  if (hash == "") {
    return null;
  }

  return JSON.parse(decompressFromBase64(hash));
}
