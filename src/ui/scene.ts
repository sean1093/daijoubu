import { repliesFor } from "../content/replies";
import { RESCUE } from "../content/rescue";
import { sceneById } from "../content/scenes";
import type { Heard, Phrase, Scene } from "../content/types";
import { slotsOf } from "../lib/jp";
import { type Ready, ready } from "../profile/fill";
import { loadProfile, type Place, placesForToday } from "../profile/profile";
import { fill, h } from "./dom";
import { jpText, playButton } from "./japanese";
import { page } from "./layout";
import { askOther, showToOther } from "./overlay";

/** The destination picked on the scene page; kept while the app is open. */
let pickedPlace: Place | null = null;

const ACTION =
  "inline-flex min-h-14 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-2 text-lg font-bold leading-tight transition active:scale-95";

function phraseCard(phrase: Phrase, line: Ready): HTMLElement {
  return h(
    "article",
    { class: "rounded-2xl bg-card p-4 shadow-sm ring-2 ring-hair" },
    h("h3", { class: "text-2xl font-bold leading-snug" }, line.zh),
    h("div", { class: "mt-2" }, jpText(line.jp, "md")),
    phrase.tip && h("p", { class: "mt-2 text-base text-muted" }, `💡 ${phrase.tip}`),
    h(
      "div",
      { class: "mt-3 grid grid-cols-2 gap-2" },
      playButton(line.jp),
      playButton(line.jp, "slow"),
      h(
        "button",
        { type: "button", class: `${ACTION} bg-ai text-on-accent`, onclick: () => showToOther([{ jp: line.jp, zh: line.zh }]) },
        "給對方看",
      ),
      phrase.answers &&
        h(
          "button",
          {
            type: "button",
            class: `${ACTION} bg-ok text-on-accent`,
            onclick: () => askOther(line, repliesFor(phrase.answers!)),
          },
          "給對方點選",
        ),
      phrase.link && h("a", { href: phrase.link.href, class: `${ACTION} col-span-2 bg-shu-soft text-shu` }, phrase.link.label),
    ),
  );
}

function heardCard(heard: Heard): HTMLElement {
  return h(
    "article",
    { class: "rounded-2xl bg-card p-4 shadow-sm ring-2 ring-hair" },
    h("p", { class: "text-base font-bold text-muted" }, "對方說："),
    h("div", { class: "mt-1" }, jpText(heard.jp, "md")),
    h("h3", { class: "mt-2 text-2xl font-bold leading-snug text-ai" }, `「${heard.zh}」`),
    h("div", { class: "mt-3 grid grid-cols-2 gap-2" }, playButton(heard.jp), playButton(heard.jp, "slow")),
    h("p", { class: "mt-4 text-base font-bold text-muted" }, "點一個回答，念給對方聽："),
    h(
      "div",
      { class: "mt-2 grid grid-cols-2 gap-2" },
      heard.replies.map((reply) =>
        h(
          "button",
          {
            type: "button",
            class: "min-h-16 rounded-2xl bg-ok-soft px-3 py-2 text-xl font-bold text-ok ring-2 ring-ok/40 active:scale-95",
            onclick: () => showToOther([{ jp: reply.jp, zh: reply.zh }], "我的回答", true),
          },
          reply.zh,
        ),
      ),
    ),
  );
}

/** 萬用救援句: one tap shows the sentence to the other person and reads it out. */
function rescueBar(): HTMLElement {
  return h(
    "details",
    { class: "mt-3 rounded-2xl bg-warn-soft p-3" },
    h(
      "summary",
      { class: "cursor-pointer text-xl font-bold" },
      "🛟 萬用句",
      h("span", { class: "ml-2 text-base font-normal text-muted" }, "請說慢一點、請寫下來…"),
    ),
    h(
      "div",
      { class: "mt-3 flex flex-wrap gap-2" },
      RESCUE.map((phrase) =>
        h(
          "button",
          {
            type: "button",
            class: "min-h-14 rounded-full bg-card px-4 text-lg font-bold ring-2 ring-hair active:scale-95",
            onclick: () => showToOther([{ jp: phrase.jp, zh: phrase.zh }], phrase.zh, true),
          },
          phrase.zh,
        ),
      ),
    ),
  );
}

/** Big buttons for the saved destinations; the picked one fills every 〇〇. */
function placePicker(places: Place[], picked: Place | null, pick: (place: Place) => void): HTMLElement {
  return h(
    "div",
    { class: "mt-3 rounded-2xl bg-ai-soft p-3" },
    h("p", { class: "text-lg font-bold" }, "要去哪裡？點一下就會換進句子裡"),
    h(
      "div",
      { class: "-mx-3 mt-2 flex gap-2 overflow-x-auto px-3 pb-1", role: "radiogroup", "aria-label": "目的地" },
      places.map((place) =>
        h(
          "button",
          {
            type: "button",
            role: "radio",
            "aria-checked": String(place === picked),
            class: `min-h-14 shrink-0 whitespace-nowrap rounded-full px-4 text-xl font-bold ring-2 ring-inset active:scale-95 ${
              place === picked ? "bg-ai text-on-accent ring-ai" : "bg-card text-ink ring-hair"
            }`,
            onclick: () => pick(place),
          },
          `${place.kind === "station" ? "🚉" : "📍"} ${place.zh || place.name}`,
        ),
      ),
    ),
  );
}

function tabs(scene: Scene, heard: boolean): HTMLElement {
  const tab = (href: string, label: string, active: boolean) =>
    h(
      "a",
      {
        href,
        "aria-current": active ? "page" : undefined,
        class: `flex min-h-14 items-center justify-center rounded-xl text-xl font-bold ${active ? "bg-ai text-on-accent" : "text-ai"}`,
      },
      label,
    );
  return h(
    "nav",
    { class: "mt-2 grid grid-cols-2 gap-1 rounded-2xl bg-card p-1 ring-2 ring-hair", "aria-label": "分頁" },
    tab(`#/scene/${scene.id}`, "🗣️ 我要說", !heard),
    tab(`#/scene/${scene.id}/heard`, "👂 對方說", heard),
  );
}

/** `#/scene/<id>` and `#/scene/<id>/heard`. */
export function renderScene(root: HTMLElement, [id, view]: string[]): void {
  const scene = sceneById(id);
  if (!scene) {
    location.replace("#/");
    return;
  }
  const heard = view === "heard";
  const profile = loadProfile();
  const places = placesForToday(profile);
  // Keep the pick across scenes, but only while it is still in the profile.
  const picked = places.find((p) => p === pickedPlace || JSON.stringify(p) === JSON.stringify(pickedPlace)) ?? places[0] ?? null;
  const usesPlace = scene.phrases.some((p) => slotsOf(p.jp).some((s) => s === "dest" || s === "stop"));
  const list = h("div", { class: "mt-4 space-y-4" });

  function drawPhrases(place: Place | null): void {
    fill(
      list,
      scene!.phrases.map((phrase) => phraseCard(phrase, ready(phrase, profile, place))),
    );
  }

  // Picking redraws only the picker and the phrases, so the page does not jump.
  const pickerSlot = h("div");
  function drawPicker(current: Place | null): void {
    fill(
      pickerSlot,
      placePicker(places, current, (place) => {
        pickedPlace = place;
        drawPicker(place);
        drawPhrases(place);
      }),
    );
  }
  if (!heard && usesPlace && places.length > 0) drawPicker(picked);

  page(root, `${scene.icon} ${scene.title}`, [
    tabs(scene, heard),
    rescueBar(),
    !heard && usesPlace && places.length === 0
      ? h(
          "a",
          { href: "#/setup", class: "mt-3 block rounded-2xl bg-ai-soft p-3 text-lg" },
          "💡 先在「設定資料」填好要去的車站，句子裡的〇〇就會自動換成站名。",
        )
      : pickerSlot,
    list,
  ]);
  if (heard) fill(list, scene.heard.map(heardCard));
  else drawPhrases(picked);
}
