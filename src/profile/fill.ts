import type { Jp, Phrase } from "../content/types";
import { fillSlots, slotsOf } from "../lib/jp";
import { hotelWord, placeWord } from "./cards";
import { currentHotel, type Place, type Profile } from "./profile";

/** A phrase ready to show: slots filled from the profile, or its fallback. */
export interface Ready {
  jp: Jp;
  zh: string;
}

/** Fills a phrase's slots, or falls back when the data it needs is missing. */
export function ready(phrase: Phrase, profile: Profile, place: Place | null): Ready {
  const slots = slotsOf(phrase.jp);
  if (slots.length === 0) return { jp: phrase.jp, zh: phrase.zh };
  const hotel = currentHotel(profile);
  const values: Partial<Record<string, string>> = {
    dest: place ? placeWord(place, true) : undefined,
    stop: place ? placeWord(place, false) : undefined,
    hotel: hotel ? hotelWord(hotel) : undefined,
  };
  if (slots.some((slot) => !values[slot])) return { jp: phrase.fallback ?? phrase.jp, zh: phrase.fallbackZh ?? phrase.zh };
  const name = place ? place.zh || place.name : "";
  return { jp: fillSlots(phrase.jp, values), zh: phrase.zh.replace("〇〇", name) };
}
