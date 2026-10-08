import { describe, expect, it } from "vitest";
import { emptyProfile } from "../src/profile/profile";
import { sectionSummaries } from "../src/profile/summary";
import { sampleProfile } from "./fixtures";

describe("setup section summaries", () => {
  it("says 尚未填寫 for every section of an empty profile", () => {
    const summaries = sectionSummaries(emptyProfile());
    expect(summaries.map((s) => s.id)).toEqual(["traveller", "hotels", "places", "contacts", "health", "allergy"]);
    for (const s of summaries) expect(s).toMatchObject({ done: false, text: "尚未填寫" });
  });

  it("sums up a full trip", () => {
    expect(sectionSummaries(sampleProfile()).map((s) => [s.done, s.text])).toEqual([
      [true, "媽媽、1956 年生"],
      [true, "2 間飯店"],
      [true, "7 個目的地"],
      [true, "2 位聯絡人、日本當地 1 位"],
      [true, "2 種慢性病、3 種藥、O 型"],
      [true, "過敏 3 項、飲食 1 項、有保險"],
    ]);
  });

  it("counts free-text entries too", () => {
    const profile = emptyProfile();
    profile.health.conditionsOther = "Glaucoma";
    profile.health.allergyOther = "Latex";
    const [, , , , health, allergy] = sectionSummaries(profile);
    expect(health?.text).toBe("1 種慢性病");
    expect(allergy?.text).toBe("過敏 1 項");
  });
});
