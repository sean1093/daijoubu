import { describe, expect, it } from "vitest";
import { EMERGENCY_NUMBERS } from "../src/content/emergency";
import { SCENES } from "../src/content/scenes";
import { checkJp } from "../src/content/validate";
import { plain } from "../src/lib/jp";
import { contactLines, helpCard, hotelCard, LINES, placeWord } from "../src/profile/cards";
import { ready } from "../src/profile/fill";
import { emptyProfile } from "../src/profile/profile";
import { sampleProfile } from "./fixtures";

describe("fixed lines", () => {
  it.each(Object.entries(LINES))("%s is well-formed", (_, markup) => {
    expect(checkJp(markup)).toEqual([]);
  });
});

describe("help card", () => {
  it("works without any data", () => {
    const blocks = helpCard(emptyProfile());
    expect(blocks.map((b) => plain(b.jp))).toEqual([
      "すみません。日本語が話せません。台湾から来た旅行者です。",
      "道に迷ってしまいました。助けてください。",
    ]);
  });

  it("brings in the hotel for the night and the family's number", () => {
    const blocks = helpCard(sampleProfile(), "2026-11-06");
    expect(blocks[0]?.extra).toEqual(["名前：LIN MEI-HUA"]);
    expect(blocks[2]?.extra).toContain("京都タワーホテル");
    expect(blocks[3]?.extra).toEqual(["女兒　林小美", "TEL +886 912-345-678", "（日本の電話から：010-886-912-345-678）"]);
    expect(blocks[4]?.extra).toEqual(["朋友　田中", "TEL 090-1234-5678"]);
    for (const block of blocks) expect(checkJp(block.jp)).toEqual([]);
  });

  it("makes a taxi card", () => {
    const card = hotelCard(sampleProfile().hotels[0]!);
    expect(card.extra).toEqual(["ホテルグレイスリー新宿", "〒 東京都新宿区歌舞伎町1-19-1", "TEL 03-6833-2489"]);
  });

  it("formats contacts without a phone", () => {
    expect(contactLines({ relation: "女兒", name: "", phone: "" }, "tw")).toEqual(["女兒"]);
  });
});

describe("place names in phrases", () => {
  it("adds 駅 to stations only when asked", () => {
    const shinjuku = { kind: "station" as const, name: "新宿駅", kana: "しんじゅくえき", zh: "新宿", date: "" };
    expect(placeWord(shinjuku, true)).toBe("{新宿|しんじゅく}{駅|えき}");
    expect(placeWord(shinjuku, false)).toBe("{新宿|しんじゅく}");
    expect(placeWord({ ...shinjuku, kind: "place", name: "浅草寺", kana: "" }, true)).toBe("浅草寺");
  });
});

describe("emergency numbers", () => {
  it.each(EMERGENCY_NUMBERS.map((e) => [e.id, e] as const))("%s names its source and check date", (_, entry) => {
    expect(entry.source).toMatch(/^https:\/\//);
    expect(entry.verified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("filling phrase slots", () => {
  const profile = sampleProfile();
  const shinjuku = profile.places[0]!;
  const phrase = SCENES[0]!.phrases.find((p) => p.id === "transport-stops-at")!;

  it("uses the picked station", () => {
    const line = ready(phrase, profile, shinjuku);
    expect(plain(line.jp)).toBe("この電車は新宿に止まりますか。");
    expect(line.zh).toBe("這班車有停新宿嗎？");
  });

  it("adds 駅 where the phrase wants a destination", () => {
    const want = SCENES[0]!.phrases.find((p) => p.id === "transport-want-to-go")!;
    expect(plain(ready(want, profile, shinjuku).jp)).toBe("新宿駅に行きたいです。");
  });

  it("falls back without a place", () => {
    const line = ready(phrase, emptyProfile(), null);
    expect(plain(line.jp)).toBe("この電車はここに止まりますか。");
    expect(line.zh).toContain("這裡");
  });

  it("produces valid markup for every phrase and place", () => {
    for (const scene of SCENES) {
      for (const p of scene.phrases) {
        for (const place of [null, ...profile.places]) expect(checkJp(ready(p, profile, place).jp)).toEqual([]);
      }
    }
  });
});
