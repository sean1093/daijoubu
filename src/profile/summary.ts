import type { Profile } from "./profile";

export type SetupSectionId = "traveller" | "hotels" | "places" | "contacts" | "health" | "allergy";

export interface SectionSummary {
  id: SetupSectionId;
  /** Something useful has been filled in. */
  done: boolean;
  /** One line for the section header, e.g. 2 間飯店 or 尚未填寫. */
  text: string;
}

const EMPTY = "尚未填寫";

/** What each section of the setup form holds, for its collapsed header. */
export function sectionSummaries(profile: Profile): SectionSummary[] {
  const h = profile.health;
  const summary = (id: SetupSectionId, parts: (string | false | 0 | "")[]): SectionSummary => {
    const filled = parts.filter((p): p is string => Boolean(p));
    return { id, done: filled.length > 0, text: filled.length > 0 ? filled.join("、") : EMPTY };
  };
  const conditions = h.conditions.length + (h.conditionsOther.trim() ? 1 : 0);
  const allergies = h.drugAllergies.length + h.foodAllergies.length + (h.allergyOther.trim() ? 1 : 0);
  const ins = profile.insurance;
  return [
    summary("traveller", [profile.callName || profile.passportName, profile.birthYear !== null && `${profile.birthYear} 年生`]),
    summary("hotels", [profile.hotels.length > 0 && `${profile.hotels.length} 間飯店`]),
    summary("places", [profile.places.length > 0 && `${profile.places.length} 個目的地`]),
    summary("contacts", [
      profile.contacts.length > 0 && `${profile.contacts.length} 位聯絡人`,
      Boolean(profile.localContact.phone || profile.localContact.name) && "日本當地 1 位",
    ]),
    summary("health", [
      conditions > 0 && `${conditions} 種慢性病`,
      h.meds.length > 0 && `${h.meds.length} 種藥`,
      h.bloodType && `${h.bloodType} 型`,
    ]),
    summary("allergy", [
      allergies > 0 && `過敏 ${allergies} 項`,
      h.diets.length > 0 && `飲食 ${h.diets.length} 項`,
      Boolean(ins.company || ins.policy || ins.phone) && "有保險",
    ]),
  ];
}
