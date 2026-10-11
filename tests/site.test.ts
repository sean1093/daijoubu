import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Read from disk: the root page is plain HTML outside the app bundle.
const root = readFileSync(new URL("../site/index.html", import.meta.url), "utf8");

describe("root page", () => {
  it("forwards to the Japan edition and keeps the hash, so old share links still open", () => {
    expect(root).toContain('"./japan/" + location.hash');
    expect(root).toContain("location.replace(target)");
  });

  it("works without JavaScript", () => {
    expect(root).toContain('href="./japan/"');
  });
});
