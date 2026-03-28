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

export type ExperienceCategory =
  | "nature"
  | "city"
  | "cultural"
  | "adventure"
  | "food"
  | "wellness"
  | "festival"
  | "other";

const CATEGORY_KEYWORDS: Record<ExperienceCategory, string[]> = {
  adventure: [
    "hik", "div", "surf", "climb", "skydiv", "raft", "trek", "bungee",
    "kayak", "paraglid", "zip", "cave", "canopy", "sail", "snorkel",
    "ski", "snowboard", "scuba", "rock climb", "abseil", "rappel",
  ],
  nature: [
    "beach", "mountain", "lake", "forest", "waterfall", "island", "volcano",
    "glacier", "reef", "canyon", "desert", "safari", "aurora", "northern light",
    "ocean", "jungle", "rainforest", "national park", "garden", "river",
    "sunset", "sunrise", "stargazing", "whale", "wildlife",
  ],
  cultural: [
    "temple", "shrine", "heritage", "ruin", "ancient", "traditional",
    "museum", "historic", "monastery", "palace", "castle", "cathedral",
    "mosque", "church", "pagoda", "pyramid", "tomb",
  ],
  festival: [
    "festival", "carnival", "celebration", "parade", "ceremony", "fiesta",
    "lantern", "cherry blossom", "new year", "mardi gras", "oktoberfest",
    "day of the dead", "holi", "songkran", "burning man",
  ],
  city: [
    "city", "market", "café", "restaurant", "tower", "skyline",
    "neighborhood", "metro", "urban", "downtown", "nightlife", "shopping",
    "rooftop", "street art", "broadway", "bar",
  ],
  food: [
    "food", "wine", "tasting", "cuisine", "culinary", "cooking", "brewery",
    "street food", "ramen", "sushi", "pasta", "chocolate", "coffee",
    "tea ceremony", "vineyard", "distillery", "gastronom",
  ],
  wellness: [
    "spa", "onsen", "hot spring", "retreat", "yoga", "meditation",
    "thermal", "bath", "mindful", "wellness", "detox",
  ],
  other: [],
};

export function deriveCategory(name: string): ExperienceCategory {
  const lower = name.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === "other") continue;
    for (const kw of keywords) {
      if (lower.includes(kw)) return category as ExperienceCategory;
    }
  }
  return "other";
}
