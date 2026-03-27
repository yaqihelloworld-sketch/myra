import type { Season } from "./types";

export function deriveSeason(date: Date): Season {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

export function formatIndex(n: number): string {
  return String(n).padStart(2, "0");
}

export function parseCommaSeparated(val: string): string[] {
  return val
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function toCommaSeparated(arr: string[]): string {
  return arr.join(",");
}
