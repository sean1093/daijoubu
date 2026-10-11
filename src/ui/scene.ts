import { repliesFor } from "../content/replies";
import { RESCUE } from "../content/rescue";
import { sceneById } from "../content/scenes";
import type { Heard, Phrase, Scene } from "../content/types";
import { plain, slotsOf } from "../lib/jp";
import { LINES } from "../profile/cards";
import { type Ready, ready } from "../profile/fill";
import { loadProfile, type Place, placesForToday } from "../profile/profile";
import { fill, h, icon, pictogram } from "./dom";
import { jpText, playButton } from "./japanese";
import { dock, heading, page } from "./layout";
import { askOther, openOverlay, overlayBar, showToOther } from "./overlay";

/** The destination picked on the scene page; kept while the app is open. */
let pickedPlace: Place | null = null;

/** Picks the destination the transport phrases use, e.g. from the home screen's "today" row. */
export function pickPlace(place: Place): void {
  pickedPlace = place;
}

const ACTION =
  "inline-flex min-h-16 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-2 text-xl font-bold leading-tight transition active:scale-95";

/** The buttons that do something with a phrase: hear it, show it, let the other person answer. */
function phraseActions(phrase: Phrase, line: Ready): HTMLElement {
  return h(
    "div",
    { class: "grid grid-cols-2 gap-3" },
    h(
      "button",
      {
        type: "button",
        class: `${ACTION} col-span-2 bg-ai text-on-accent`,
        onclick: () => showToOther([{ jp: line.jp, zh: line.zh }]),
      },
      icon("expand"),
      "給對方看",
    ),
    playButton(line.jp, "normal", "lg"),
    playButton(line.jp, "slow", "lg"),
    phrase.answers &&
      h(
        "button",
        {
          type: "button",
          // Soft, so 給對方看 stays the one solid action; green still means "answers".
          class: `${ACTION} col-span-2 bg-ok-soft text-ok ring-1 ring-ok/40`,
          onclick: () => askOther(line, repliesFor(phrase.answers!)),
        },
        icon("hand"),
        "給對方點選答案",
      ),
    phrase.link && h("a", { href: phrase.link.href, class: `${ACTION} col-span-2 bg-shu-soft text-shu` }, phrase.link.label),
  );
}

/** A usage hint for the traveller: an info mark, not decoration. */
function tip(text: string): HTMLElement {
  return h(
    "p",
    { class: "mt-3 flex gap-2 rounded-lg bg-warn-soft p-3 text-lg leading-relaxed" },
    icon("info", "mt-1 h-5 w-5 shrink-0 text-muted"),
    h("span", null, text),
  );
}

/** One phrase, full screen: everything needed to say it, in one place. */
export function openPhrase(phrase: Phrase, line: Ready): void {
  openOverlay(line.zh, (close) =>
    h(
      "div",
      { class: "flex min-h-0 flex-1 flex-col" },
      overlayBar(close, "選一種方式"),
      h(
        "div",
        { class: "min-h-0 flex-1 overflow-y-auto px-5 pb-safe pt-4" },
        h("h2", { class: "text-3xl font-bold leading-snug" }, line.zh),
        h("div", { class: "mt-3 rounded-xl bg-card p-4 ring-1 ring-hair" }, jpText(line.jp, "lg")),
        phrase.tip && tip(phrase.tip),
        h("div", { class: "mt-5" }, phraseActions(phrase, line)),
      ),
    ),
  );
}

/** A phrase as a list row: the Chinese to find it by, a hint of the Japanese, and a way in. */
export function phraseRow(phrase: Phrase, line: Ready): HTMLElement {
  return h(
    "button",
    {
      type: "button",
      class:
        // Rows sit in a shared card (rowGroup), so they draw no box of their own; the
        // focus ring is drawn inside, where the card's rounded corners cannot clip it.
        "flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-ai-soft focus-visible:[outline-offset:-3px]",
      onclick: () => openPhrase(phrase, line),
    },
    h(
      "span",
      { class: "min-w-0 flex-1" },
      h("span", { class: "block text-xl font-semibold leading-snug" }, line.zh),
      h("span", { lang: "ja", class: "mt-0.5 block truncate text-base text-muted" }, plain(line.jp)),
    ),
    icon("next", "h-6 w-6 shrink-0 text-ai"),
  );
}

/** Rows of one group in one card, split by hairlines: a list, not a stack of boxes. */
export function rowGroup(rows: HTMLElement[]): HTMLElement {
  return h("div", { class: "divide-y divide-hair overflow-hidden rounded-xl bg-card ring-1 ring-hair" }, rows);
}

/** What staff say: the Chinese first and largest, the Japanese to check against, then the answers. */
function heardCard(heard: Heard): HTMLElement {
  return h(
    "article",
    { class: "rounded-xl bg-card p-3 ring-1 ring-hair" },
    h("h3", { class: "text-2xl font-bold leading-snug" }, heard.zh),
    h("p", { lang: "ja", class: "mt-1 text-lg text-muted" }, plain(heard.jp)),
    h("div", { class: "mt-1 flex gap-2" }, playButton(heard.jp, "normal", "sm"), playButton(heard.jp, "slow", "sm")),
    h(
      "div",
      { class: `mt-2 grid gap-2 ${heard.replies.length === 3 ? "grid-cols-3" : "grid-cols-2"}` },
      heard.replies.map((reply) =>
        h(
          "button",
          {
            type: "button",
            class: "min-h-14 rounded-xl bg-ok-soft px-2 py-2 text-lg font-bold leading-tight text-ok ring-1 ring-ok/40 active:scale-95",
            onclick: () => showToOther([{ jp: reply.jp, zh: reply.zh }], "我的回答", true),
          },
          reply.zh,
        ),
      ),
    ),
  );
}

/** 萬用救援句 in a sheet: one tap shows the sentence to the other person and reads it out. */
export function openRescue(): void {
  openOverlay("萬用句", (close) =>
    h(
      "div",
      { class: "flex min-h-0 flex-1 flex-col" },
      overlayBar(close, "點一句，念給對方聽"),
      h(
        "div",
        { class: "min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-safe pt-4" },
        RESCUE.map((phrase) =>
          h(
            "button",
            {
              type: "button",
              class: "block min-h-16 w-full rounded-xl bg-card px-4 py-2 text-left ring-1 ring-hair active:scale-[0.98] active:bg-warn-soft",
              onclick: () => showToOther([{ jp: phrase.jp, zh: phrase.zh }], phrase.zh, true),
            },
            h("span", { class: "block text-xl font-bold leading-snug" }, phrase.zh),
            h("span", { lang: "ja", class: "mt-0.5 block text-base text-muted" }, plain(phrase.jp)),
          ),
        ),
      ),
    ),
  );
}

/** Docked at the bottom of every scene, so help with a stuck conversation is one tap from anywhere. */
function rescueDock(): HTMLElement[] {
  return dock(
    "萬用句",
    h(
      "button",
      {
        type: "button",
        class: "flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-warn-soft text-xl font-bold text-ink ring-1 ring-hair active:scale-[0.98]",
        onclick: openRescue,
      },
      icon("lifebuoy", "h-6 w-6"),
      "萬用句",
      h("span", { class: "text-base font-normal text-muted" }, "聽不懂・請說慢一點…"),
    ),
  );
}

/** Big buttons for the saved destinations; the picked one fills every 〇〇. */
/** The picked station's 電梯筆記, ready to enlarge for station staff. */
function elevatorNote(place: Place): HTMLElement {
  return h(
    "div",
    { class: "mt-3 rounded-xl bg-card p-3 ring-1 ring-hair" },
    h("p", { class: "flex items-center gap-2 text-lg font-bold" }, pictogram("elevator", "exit", "sm"), `${place.zh || place.name}・電梯筆記`),
    h("p", { class: "mt-1 whitespace-pre-line break-words text-lg" }, place.note),
    h(
      "button",
      {
        type: "button",
        class: "mt-2 inline-flex min-h-12 items-center gap-2 rounded-lg bg-ai px-4 text-lg font-bold text-on-accent active:scale-95",
        // The note is shown as typed (it may not be Japanese); the line above it is what gets read out.
        onclick: () =>
          showToOther(
            [{ jp: LINES.wantElevator, zh: "我想搭電梯（下面是事先查好的電梯資訊）", extra: place.note.split(/\n+/).filter(Boolean) }],
            "電梯筆記",
          ),
      },
      icon("expand", "h-5 w-5"),
      "放大給站務員看",
    ),
  );
}

function placePicker(places: Place[], picked: Place | null, pick: (place: Place) => void): HTMLElement {
  return h(
    "div",
    { class: "mt-3 rounded-xl bg-ai-soft p-3" },
    h("p", { class: "text-lg font-bold" }, "要去哪裡？點一下換進句子"),
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
            class: `inline-flex min-h-14 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-xl font-bold ring-1 ring-inset active:scale-95 ${
              place === picked ? "bg-ai text-on-accent ring-ai" : "bg-card text-ink ring-hair"
            }`,
            onclick: () => pick(place),
          },
          icon(place.kind === "station" ? "train" : "pin", "h-5 w-5"),
          place.zh || place.name,
          place.note && h("span", { class: "sr-only" }, "（有電梯筆記）"),
          place.note && icon("elevator", "h-5 w-5"),
        ),
      ),
    ),
    picked?.note && elevatorNote(picked),
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
    { class: "mt-2 grid grid-cols-2 gap-1 rounded-xl bg-card p-1 ring-1 ring-hair", "aria-label": "分頁" },
    tab(`#/scene/${scene.id}`, "我要說", !heard),
    tab(`#/scene/${scene.id}/heard`, "對方說", heard),
  );
}

/** The phrase rows, under the scene's headings when it has them. */
function phraseList(scene: Scene, line: (phrase: Phrase) => Ready): HTMLElement[] {
  const rows = (phrases: Phrase[]) => rowGroup(phrases.map((p) => phraseRow(p, line(p))));
  if (!scene.groups) return [rows(scene.phrases)];
  return scene.groups.map((group) =>
    h(
      "section",
      { class: "space-y-2" },
      h("div", { class: "pt-2" }, heading(group.title)),
      rows(scene.phrases.filter((p) => p.group === group.id)),
    ),
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
  const list = h("div", { class: "mt-4 space-y-3" });

  function drawPhrases(place: Place | null): void {
    fill(list, phraseList(scene!, (phrase) => ready(phrase, profile, place)));
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

  page(root, scene.title, [
    tabs(scene, heard),
    !heard && usesPlace && places.length === 0
      ? h(
          "a",
          { href: "#/setup", class: "mt-3 block rounded-xl bg-ai-soft p-3 text-lg" },
          "先在「設定資料」填好要去的車站，句子裡的〇〇就會自動換成站名。",
        )
      : pickerSlot,
    heard && h("p", { class: "mt-3 text-lg text-muted" }, "聽到對方這樣說時，點一個回答，手機會念給對方聽。"),
    list,
    rescueDock(),
  ]);
  if (heard) fill(list, scene.heard.map(heardCard));
  else drawPhrases(picked);
}
