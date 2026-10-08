import { describe, expect, it } from "vitest";
import { fillSlots, plain, romaji, slotsOf, userWord } from "../src/lib/jp";

describe("markup", () => {
  it("derives plain text and romaji", () => {
    expect(plain("{新宿|しんじゅく} に {行|い}きたい です。")).toBe("新宿に行きたいです。");
    expect(romaji("{新宿|しんじゅく} は どこ です か。")).toBe("shinjuku wa doko desu ka.");
  });

  it("finds and fills slots", () => {
    const markup = "この {電車|でんしゃ} は $stop に {止|と}まります か。";
    expect(slotsOf(markup)).toEqual(["stop"]);
    expect(plain(fillSlots(markup, { stop: "{新宿|しんじゅく}" }))).toBe("この電車は新宿に止まりますか。");
  });

  it("skips romaji for words without a known reading", () => {
    expect(romaji("{東京|とうきょう} 箱根湯本 です")).toBe("toukyou desu");
  });
});

describe("userWord", () => {
  it("keeps typed names as one safe word", () => {
    expect(userWord(" Hotel  Gracery 新宿 ")).toBe("Hotel Gracery 新宿");
    expect(userWord("新{宿|x}$")).toBe("新宿x");
    expect(userWord("新宿", "しんじゅく")).toBe("{新宿|しんじゅく}");
    expect(userWord("新宿", "shinjuku")).toBe("新宿");
    expect(userWord("   ")).toBe("");
  });

  it("produces markup that parses and reads back", () => {
    const word = userWord("ホテル {evil} | test");
    expect(() => plain(word)).not.toThrow();
  });
});
