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
function callButton(label: string, sub: string, tel: string): HTMLElement {
  return h(
    "a",
    {
      href: `tel:${tel}`,
      class: "flex min-h-16 items-center gap-3 rounded-2xl bg-card px-4 py-3 text-ink ring-2 ring-hair transition active:scale-[0.98]",
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
        { class: "grid grid-cols-3 gap-2" },
        playButton(lines, "normal", "md", "whitespace-nowrap"),
        playButton(lines, "slow", "md", "whitespace-nowrap"),
        h(
          "button",
          {
            type: "button",
            class: "inline-flex min-h-14 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-ai-soft px-2 text-lg font-bold text-ai active:scale-95",
            onclick: () => showToOther(blocks, "我需要幫忙"),
          },
          icon("expand"),
          "放大",
        ),
      ),
      blocks.map((block) => cardBlock(block)),
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
        EMERGENCY_NUMBERS.filter((e) => MAIN_NUMBERS.includes(e.id)).map((entry) =>
          callButton(entry.title, `${entry.number}・${entry.when}`, telOf(entry.number)),
        ),
        h(
          "details",
          { class: "rounded-2xl bg-card p-4 ring-2 ring-hair" },
          h("summary", { class: "cursor-pointer text-xl font-bold text-ai" }, "更多電話（各地辦事處、外交部）"),
          h(
            "div",
            { class: "mt-3 space-y-3" },
            EMERGENCY_NUMBERS.filter((e) => !MAIN_NUMBERS.includes(e.id) && !DOCKED_NUMBERS.includes(e.id)).map((entry) =>
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
      // Room for the dock, so it never covers the last line.
      h("div", { class: "h-24", "aria-hidden": "true" }),
    ),
    callDock(family?.relation || "家人", familyPhone?.tel ?? null),
  );
}

/** 110 and 119 live in the dock; these two come first in the list below the card. */
const DOCKED_NUMBERS = ["police", "ambulance"];
const MAIN_NUMBERS = ["jnto-hotline", "tecro-tokyo"];

/**
 * Calls that matter most, docked at the bottom so they are reachable from
 * anywhere on the page. 110 and 119 ask first: a pocket tap should not
 * summon the police.
 */
function callDock(familyLabel: string, familyTel: string | null): HTMLElement {
  const dial = (top: string, bottom: string, tel: string, confirmText: string | null, tone: string) =>
    h(
      "a",
      {
        href: `tel:${tel}`,
        class: `flex min-h-16 flex-col items-center justify-center rounded-2xl px-1 text-center font-bold leading-tight active:scale-95 ${tone}`,
        onclick: (event: Event) => {
          if (confirmText && !confirm(confirmText)) event.preventDefault();
        },
      },
      h("span", { class: "block whitespace-nowrap text-xl" }, top),
      h("span", { class: "block whitespace-nowrap text-base" }, bottom),
    );
  const police = EMERGENCY_NUMBERS.find((e) => e.id === "police");
  const ambulance = EMERGENCY_NUMBERS.find((e) => e.id === "ambulance");
  return h(
    "nav",
    { class: "pb-safe fixed inset-x-0 bottom-0 z-20 border-t-2 border-hair bg-paper/95 backdrop-blur", "aria-label": "撥打電話" },
    h(
      "div",
      { class: `mx-auto grid max-w-xl gap-2 px-4 pt-2 ${familyTel ? "grid-cols-3" : "grid-cols-2"}` },
      familyTel && dial("📞 打給", familyLabel, familyTel, null, "bg-ai text-on-accent"),
      police && dial("🚓 110", "警察", telOf(police.number), "要打 110 報警嗎？", "bg-shu text-on-accent"),
      ambulance && dial("🚑 119", "救護車", telOf(ambulance.number), "要打 119 叫救護車嗎？", "bg-shu text-on-accent"),
    ),
  );
}
