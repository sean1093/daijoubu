import { EMERGENCY_NUMBERS, telOf } from "../content/emergency";
import { plain } from "../lib/jp";
import { dialable } from "../lib/phone";
import { type CardBlock, helpCard, LINES } from "../profile/cards";
import { loadProfile } from "../profile/profile";
import { fill, h, icon } from "./dom";
import { playButton } from "./japanese";
import { showToOther } from "./overlay";

/** One block of the help card: Japanese large for the helper, Chinese small for the traveller. */
export function cardBlock(block: CardBlock, size = "text-3xl"): HTMLElement {
  return h(
    "div",
    { class: "rounded-2xl bg-card p-4 ring-2 ring-hair" },
    h("p", { lang: "ja", class: `${size} font-bold leading-snug` }, plain(block.jp)),
    block.extra.length > 0 &&
      h(
        "div",
        { lang: "ja", class: "mt-3 space-y-1 border-l-4 border-shu pl-3 text-2xl font-bold leading-snug" },
        block.extra.map((line) => h("p", { class: "break-words" }, line)),
      ),
    h("p", { class: "mt-2 text-lg text-muted" }, block.zh),
  );
}

/** A big `tel:` button. */
function callButton(label: string, sub: string, tel: string, tone: "danger" | "normal" = "normal"): HTMLElement {
  return h(
    "a",
    {
      href: `tel:${tel}`,
      class: `flex min-h-16 items-center gap-3 rounded-2xl px-4 py-3 transition active:scale-[0.98] ${
        tone === "danger" ? "bg-shu text-on-accent" : "bg-card text-ink ring-2 ring-hair"
      }`,
    },
    icon("phone", "h-7 w-7 shrink-0"),
    h("span", { class: "min-w-0" }, h("span", { class: "block text-2xl font-bold" }, label), h("span", { class: "block text-base" }, sub)),
  );
}

/** `#/help`: the card to show a passer-by, station staff or the police. */
export function renderHelp(root: HTMLElement): void {
  const profile = loadProfile();
  const blocks = helpCard(profile);
  const family = profile.contacts[0];
  const familyPhone = family ? dialable(family.phone, "tw") : null;
  const lines = blocks.map((b) => b.jp);

  fill(
    root,
    h(
      "header",
      { class: "pt-safe sticky top-0 z-10 flex items-center justify-between gap-2 bg-shu px-3 pb-2 text-on-accent" },
      h(
        "a",
        { href: "#/", class: "inline-flex min-h-14 items-center gap-1 rounded-full px-3 text-lg font-bold active:bg-black/10" },
        icon("back", "h-6 w-6"),
        "回首頁",
      ),
      h("h1", { class: "text-2xl font-bold" }, "🆘 我需要幫忙"),
    ),
    h(
      "main",
      { class: "space-y-4 px-4 pb-16 pt-4" },
      h("p", { class: "text-lg font-bold text-shu" }, "把手機拿給路人、車站人員或警察看 👇"),
      h(
        "div",
        { class: "flex flex-wrap gap-3" },
        playButton(lines, "normal", "flex-1"),
        playButton(lines, "slow", "flex-1"),
        h(
          "button",
          {
            type: "button",
            class: "inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-full bg-ai-soft px-5 text-lg font-bold text-ai active:scale-95",
            onclick: () => showToOther(blocks, "我需要幫忙"),
          },
          icon("expand"),
          "放大",
        ),
      ),
      blocks.map((block) => cardBlock(block)),
      familyPhone &&
        callButton(
          `打電話給${family?.relation || "家人"}`,
          `${familyPhone.display}（國際電話，會收費）`,
          familyPhone.tel,
        ),
      blocks.length <= 2 &&
        h(
          "a",
          { href: "#/setup", class: "block rounded-2xl bg-ai-soft p-4 text-lg" },
          "還沒有填飯店和家人電話。按這裡填好，卡片就會自動帶入地址和電話。",
        ),
      h(
        "section",
        { class: "space-y-3 pt-4" },
        h("h2", { class: "text-2xl font-bold" }, "👮 找警察（交番）"),
        h(
          "p",
          { class: "text-lg leading-relaxed" },
          "日本街上和車站附近常有派出所，叫「交番」（KOBAN），門口有紅色的燈。迷路、東西掉了都可以進去問，不用錢。",
        ),
        h(
          "button",
          {
            type: "button",
            class: "flex min-h-16 w-full items-center gap-3 rounded-2xl bg-card px-4 text-left text-xl font-bold ring-2 ring-hair active:scale-[0.98]",
            onclick: () =>
              showToOther(
                [
                  { jp: LINES.koban, zh: "附近的派出所在哪裡？" },
                  { jp: LINES.callPolice, zh: "請幫我叫警察。" },
                ],
                "找警察",
              ),
          },
          icon("expand", "h-7 w-7 shrink-0 text-ai"),
          h("span", null, "給對方看：附近的派出所在哪裡？", h("span", { lang: "ja", class: "block text-base font-normal text-muted" }, plain(LINES.koban))),
        ),
      ),
      h(
        "section",
        { class: "space-y-3 pt-4" },
        h("h2", { class: "text-2xl font-bold" }, "☎️ 緊急電話"),
        EMERGENCY_NUMBERS.slice(0, 2).map((entry) =>
          callButton(`${entry.number} ${entry.title}`, entry.when, telOf(entry.number), "danger"),
        ),
        EMERGENCY_NUMBERS.filter((e) => !e.id.startsWith("tecro-") || e.id === "tecro-tokyo")
          .slice(2)
          .map((entry) => callButton(entry.title, `${entry.number}・${entry.when}`, telOf(entry.number))),
        h(
          "details",
          { class: "rounded-2xl bg-card p-4 ring-2 ring-hair" },
          h("summary", { class: "cursor-pointer text-xl font-bold text-ai" }, "各地辦事處的急難救助電話"),
          h(
            "div",
            { class: "mt-3 space-y-3" },
            EMERGENCY_NUMBERS.filter((e) => e.id.startsWith("tecro-") && e.id !== "tecro-tokyo").map((entry) =>
              callButton(entry.title, `${entry.number}・${entry.when}`, telOf(entry.number)),
            ),
          ),
        ),
        h(
          "p",
          { class: "text-base text-muted" },
          "電話號碼查證日期：",
          EMERGENCY_NUMBERS[0]?.verified ?? "",
          "。來源為日本政府觀光局、日本消防廳、日本警察與中華民國外交部、駐日代表處官方網站。",
        ),
      ),
    ),
  );
}
