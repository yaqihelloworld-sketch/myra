export type Status = "wishlist" | "planned" | "visited";
export type Season = "spring" | "summer" | "autumn" | "winter";
export type PartnerType = "solo" | "romantic" | "friends" | "family" | "kids";

export const SEASONS: Season[] = ["spring", "summer", "autumn", "winter"];
export const PARTNER_TYPES: PartnerType[] = ["solo", "romantic", "friends", "family", "kids"];
export const STATUSES: Status[] = ["wishlist", "planned", "visited"];

export type DoByAge = "30" | "40" | "50" | "60+";
export const DO_BY_AGES: DoByAge[] = ["30", "40", "50", "60+"];

export interface Experience {
  id: number;
  name: string;
  description: string | null;
  city: string | null;
  country: string;
  idealSeasons: string;
  idealPartnerTypes: string;
  estimatedDays: number | null;
  doByAge: string | null;
  status: string;
  createdAt: string;
}

export interface Trip {
  id: number;
  name: string;
  startDate: string | null;
  endDate: string | null;
  season: string | null;
  partnerType: string | null;
  createdAt: string;
}

export interface ExperiencePhoto {
  id: number;
  experienceId: number;
  unsplashId: string;
  url: string;
  thumbUrl: string;
  altDescription: string | null;
  photographerName: string;
  photographerUrl: string;
}

export interface TripWithExperiences extends Trip {
  experiences: Experience[];
}
