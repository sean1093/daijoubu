import { describe, expect, it } from "vitest";
import { emptyProfile } from "../src/profile/profile";
import { greeting, todaysPlaces } from "../src/ui/home";
import { sampleProfile } from "./fixtures";

describe("home", () => {
  it("greets in one short line", () => {
    expect(greeting(sampleProfile())).toBe("媽媽，旅途平安");
    expect(greeting(emptyProfile())).toBe("日本旅遊小幫手");
  });

  it("lists only today's places", () => {
    expect(todaysPlaces(sampleProfile(), "2026-11-03").map((p) => p.name)).toEqual(["浅草", "浅草寺"]);
    expect(todaysPlaces(sampleProfile(), "2026-12-01")).toEqual([]);
  });
});
