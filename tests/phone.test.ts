import { describe, expect, it } from "vitest";
import { dialable } from "../src/lib/phone";

describe("dialable", () => {
  it("treats a bare number as Taiwanese for family", () => {
    expect(dialable("0912-345-678", "tw")).toEqual({
      tel: "+886912345678",
      display: "+886 912-345-678",
      fromJapan: "010-886-912-345-678",
    });
  });

  it("keeps an explicit country code", () => {
    expect(dialable("+886 2 2345 6789", "jp")?.fromJapan).toBe("010-886-2-2345-6789");
    expect(dialable("+886-0912345678", "jp")?.tel).toBe("+886912345678");
  });

  it("dials Japanese numbers domestically", () => {
    expect(dialable("03-1234-5678", "jp")).toEqual({ tel: "0312345678", display: "03-1234-5678", fromJapan: null });
    expect(dialable("+81 90 1234 5678", "tw")).toEqual({
      tel: "09012345678",
      display: "090-1234-5678",
      fromJapan: null,
    });
    expect(dialable("０３ー１２３４ー５６７８", "jp")?.tel).toBe("0312345678");
  });

  it("rejects junk", () => {
    expect(dialable("", "tw")).toBeNull();
    expect(dialable("abc", "tw")).toBeNull();
  });
});
