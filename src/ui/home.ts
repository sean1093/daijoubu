import { SCENES } from "../content/scenes";
import { voiceStatus } from "../lib/speech";
import { isEmpty, isPlannedFor, loadProfile, type Place, type Profile, today } from "../profile/profile";
import { fill, h, icon, pictogram } from "./dom";
import { guideRows } from "./guide";
import { heading } from "./layout";
import { pickPlace } from "./scene";

const TILE =
  "flex min-h-28 flex-col items-start justify-between gap-3 rounded-2xl bg-card px-4 py-4 text-left text-xl font-bold text-ink transition active:scale-[0.97] active:bg-ai-soft";
const SHORTCUT =
  "flex min-h-16 items-center gap-3 rounded-2xl bg-sand px-3 py-2 text-xl font-bold leading-tight text-ink transition active:scale-[0.97] active:bg-ai-soft";

/** One short line: the app greets by name when it has one. */
export function greeting(profile: Profile): string {
  return profile.callName ? `${profile.callName}，旅途平安` : "隨身旅伴";
}

/** Places dated today, in itinerary order. */
export function todaysPlaces(profile: Profile, day = today()): Place[] {
  return profile.places.filter((place) => isPlannedFor(place, day));
}

/** "今天要去": one tap opens transport with that place already picked. */
function todayRow(places: Place[]): HTMLElement {
  return h(
    "section",
    { class: "mt-5" },
    heading("今天要去"),
    h(
      "div",
      { class: "-mx-3 mt-2 flex gap-2 overflow-x-auto px-3 pb-1" },
      places.map((place) =>
        h(
          "button",
          {
            type: "button",
            class: "inline-flex min-h-14 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-card px-3 text-xl font-bold active:scale-95 active:bg-ai-soft",
            onclick: () => {
              pickPlace(place);
              location.hash = "#/scene/transport";
            },
          },
          icon(place.kind === "station" ? "train" : "pin", "h-6 w-6 text-ai"),
          place.zh || place.name,
          icon("next", "h-5 w-5 text-muted"),
        ),
      ),
    ),
  );
}

export function renderHome(root: HTMLElement): void {
  const profile = loadProfile();
  const empty = isEmpty(profile);
  const places = todaysPlaces(profile);
  fill(
    root,
    h(
      "main",
      { class: "pt-safe px-4 pb-10" },
      h("h1", { class: "mt-2 truncate text-2xl font-bold" }, greeting(profile)),
      voiceStatus() === "missing" &&
        h(
          "a",
          { href: "#/settings", class: "mt-3 flex items-center gap-2 rounded-2xl bg-warn-soft p-3 text-lg font-bold" },
          icon("alert", "h-6 w-6 shrink-0"),
          "這支手機還不會念日文 → 怎麼安裝",
        ),
      h(
        "a",
        {
          href: "#/help",
          class: "mt-3 flex min-h-28 items-center gap-4 rounded-2xl bg-shu px-5 py-4 text-on-accent transition active:scale-[0.98]",
        },
        icon("help", "h-11 w-11 shrink-0"),
        h(
          "span",
          { class: "text-left" },
          h("span", { class: "block whitespace-nowrap text-[min(2rem,9vw)] font-bold leading-tight" }, "我需要幫忙"),
          h("span", { class: "block text-lg" }, "迷路・找家人・急病"),
        ),
      ),
      empty &&
        h(
          "section",
          { class: "mt-3 rounded-2xl bg-ai-soft p-4" },
          h("h2", { class: "text-xl font-bold text-ai" }, "第一次使用"),
          h(
            "p",
            { class: "mt-1 text-lg leading-relaxed" },
            "先填好飯店、行程和聯絡人，求救卡和站名就會自動帶入。有收到分享連結的話，直接點開就好。",
          ),
          h(
            "a",
            {
              href: "#/setup",
              class: "mt-3 flex min-h-14 items-center justify-center gap-2 rounded-lg bg-ai text-xl font-bold text-on-accent active:scale-[0.98]",
            },
            icon("edit"),
            "開始填資料",
          ),
        ),
      h(
        "div",
        { class: "mt-3 grid grid-cols-2 gap-3" },
        h("a", { href: "#/hotel", class: SHORTCUT }, pictogram("taxi", "ai", "sm"), "回飯店"),
        h("a", { href: "#/medical", class: SHORTCUT }, pictogram("medcard", "shu", "sm"), "醫療卡"),
      ),
      places.length > 0 && todayRow(places),
      h(
        "nav",
        { class: "mt-5", "aria-label": "情境" },
        heading("情境"),
        h(
          "div",
          { class: "grid grid-cols-2 gap-3" },
          SCENES.map((scene, i) =>
            h(
              "a",
              {
                href: `#/scene/${scene.id}`,
                // With an odd number of scenes the last tile spans the row, so the grid has no gap.
                class: i === SCENES.length - 1 && SCENES.length % 2 === 1 ? `${TILE} col-span-2` : TILE,
              },
              pictogram(scene.icon, scene.id === "emergency" ? "shu" : "ai"),
              scene.title,
            ),
          ),
        ),
      ),
      h("section", { class: "mt-6" }, heading("旅遊小抄"), guideRows()),
      h(
        "nav",
        { class: "mt-8 flex flex-wrap justify-center gap-x-2 gap-y-1 text-lg", "aria-label": "其他" },
        [
          ["#/settings", "字體與聲音"],
          ["#/setup", "設定資料"],
          ["#/print", "列印小卡"],
        ].map(([href, label]) =>
          h("a", { href, class: "inline-flex min-h-12 items-center rounded-lg px-3 font-bold text-ai underline underline-offset-4" }, label),
        ),
      ),
    ),
  );
}
