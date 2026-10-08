import { SCENES } from "../content/scenes";
import { voiceStatus } from "../lib/speech";
import { isEmpty, loadProfile, type Place, type Profile, today } from "../profile/profile";
import { fill, h, icon } from "./dom";
import { pickPlace } from "./scene";

const TILE =
  "flex min-h-28 flex-col items-center justify-center gap-1 rounded-3xl bg-card px-2 py-3 text-center text-2xl font-bold text-ink shadow-sm ring-2 ring-hair transition active:scale-95";
const SHORTCUT =
  "flex min-h-20 items-center justify-center gap-2 rounded-3xl bg-card px-2 py-2 text-xl font-bold leading-tight text-ink shadow-sm ring-2 ring-hair transition active:scale-95";

/** One short line: the app greets by name when it has one. */
export function greeting(profile: Profile): string {
  return profile.callName ? `${profile.callName}，旅途平安` : "日本旅遊小幫手";
}

/** Places dated today, in itinerary order. */
export function todaysPlaces(profile: Profile, day = today()): Place[] {
  return profile.places.filter((place) => place.date === day);
}

/** "今天要去": one tap opens transport with that place already picked. */
function todayRow(places: Place[]): HTMLElement {
  return h(
    "section",
    { class: "mt-4 rounded-2xl bg-ai-soft p-3" },
    h("h2", { class: "text-lg font-bold" }, "今天要去"),
    h(
      "div",
      { class: "-mx-3 mt-2 flex gap-2 overflow-x-auto px-3 pb-1" },
      places.map((place) =>
        h(
          "button",
          {
            type: "button",
            class: "inline-flex min-h-14 shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-card px-4 text-xl font-bold ring-2 ring-hair active:scale-95",
            onclick: () => {
              pickPlace(place);
              location.hash = "#/scene/transport";
            },
          },
          `${place.kind === "station" ? "🚉" : "📍"} ${place.zh || place.name}`,
          icon("next", "h-5 w-5 text-ai"),
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
          class:
            "mt-3 flex min-h-32 items-center justify-center gap-3 rounded-3xl bg-shu px-4 py-4 text-on-accent shadow-md transition active:scale-[0.98]",
        },
        h("span", { class: "text-4xl", "aria-hidden": "true" }, "🆘"),
        h(
          "span",
          { class: "text-left" },
          h("span", { class: "block whitespace-nowrap text-[min(2rem,9vw)] font-bold leading-tight" }, "我需要幫忙"),
          h("span", { class: "block text-lg" }, "迷路・聯絡家人・緊急"),
        ),
      ),
      empty &&
        h(
          "section",
          { class: "mt-3 rounded-2xl bg-ai-soft p-4" },
          h("h2", { class: "text-xl font-bold text-ai" }, "👋 第一次使用？"),
          h(
            "p",
            { class: "mt-1 text-lg leading-relaxed" },
            "先填好飯店、行程和聯絡人，求救卡和站名就會自動帶入。有收到分享連結的話，直接點開就好。",
          ),
          h(
            "a",
            {
              href: "#/setup",
              class: "mt-3 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-ai text-xl font-bold text-on-accent active:scale-[0.98]",
            },
            icon("edit"),
            "開始填資料",
          ),
        ),
      h(
        "div",
        { class: "mt-3 grid grid-cols-2 gap-3" },
        h("a", { href: "#/hotel", class: SHORTCUT }, h("span", { class: "text-3xl", "aria-hidden": "true" }, "🚕"), "回飯店"),
        h("a", { href: "#/medical", class: SHORTCUT }, h("span", { class: "text-3xl", "aria-hidden": "true" }, "🩺"), "醫療卡"),
      ),
      places.length > 0 && todayRow(places),
      h(
        "nav",
        { class: "mt-4 grid grid-cols-2 gap-3", "aria-label": "情境" },
        SCENES.map((scene) =>
          h(
            "a",
            { href: `#/scene/${scene.id}`, class: TILE },
            h("span", { class: "text-5xl leading-none", "aria-hidden": "true" }, scene.icon),
            scene.title,
          ),
        ),
      ),
      h(
        "nav",
        { class: "mt-8 flex flex-wrap justify-center gap-x-2 gap-y-1 text-lg", "aria-label": "其他" },
        [
          ["#/settings", "字體與聲音"],
          ["#/setup", "設定資料"],
          ["#/print", "列印小卡"],
        ].map(([href, label]) =>
          h("a", { href, class: "inline-flex min-h-12 items-center rounded-full px-3 font-bold text-ai underline underline-offset-4" }, label),
        ),
      ),
    ),
  );
}
