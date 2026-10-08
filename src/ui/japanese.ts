import type { Jp } from "../content/types";
import { parse, plain, wordRomaji } from "../lib/jp";
import { speak, stopSpeaking } from "../lib/speech";
import { SLOW_RATE } from "../state";
import { h, icon } from "./dom";

const SIZES = {
  xl: { jp: "text-3xl font-bold", romaji: "text-base" },
  lg: { jp: "text-2xl font-semibold", romaji: "text-sm" },
  md: { jp: "text-xl", romaji: "text-sm" },
};

/**
 * A Japanese line: ruby over the kanji, and under each word its romaji (from
 * Ippo's jpText). Words whose reading is unknown — a typed name without kana —
 * simply have no romaji.
 */
export function jpText(markup: Jp, size: keyof typeof SIZES = "md", options: { romaji?: boolean } = {}): HTMLElement {
  const line = h("span", { lang: "ja", class: `jp block ${SIZES[size].jp}` });
  parse(markup).forEach((word, i) => {
    if (i > 0) line.append(" ");
    const japanese = h("span", { class: "block" });
    for (const segment of word) {
      japanese.append(segment.ruby ? h("ruby", null, segment.text, h("rt", null, segment.ruby)) : segment.text);
    }
    const reading = word.map((segment) => segment.ruby ?? segment.text).join("");
    const roma = options.romaji === false ? "" : wordRomaji(reading);
    line.append(
      h(
        "span",
        { class: "word" },
        japanese,
        // Hidden from screen readers, which already read the Japanese.
        roma && h("span", { class: `romaji block text-muted ${SIZES[size].romaji}`, "aria-hidden": "true" }, roma),
      ),
    );
  });
  return line;
}

// `generation` advances whenever new audio is requested, so a running
// sequence notices it has been superseded.
let generation = 0;

function mark(button: HTMLElement | undefined): void {
  for (const el of document.querySelectorAll(".speaking")) el.classList.remove("speaking");
  button?.classList.add("speaking");
}

/** Speaks `markup`, marking `button` while it plays. Interrupts anything already playing. */
export async function play(markup: Jp, button?: HTMLElement, rate?: number): Promise<void> {
  const mine = ++generation;
  mark(button);
  await speak(markup, rate === undefined ? {} : { rate });
  if (mine === generation) button?.classList.remove("speaking");
}

/** Speaks lines one after another; stops as soon as anything else plays or `hush` is called. */
export async function playAll(lines: Jp[], button?: HTMLElement, rate?: number): Promise<void> {
  const mine = ++generation;
  mark(button);
  for (const line of lines) {
    await speak(line, rate === undefined ? {} : { rate });
    if (mine !== generation) return;
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    if (mine !== generation) return;
  }
  button?.classList.remove("speaking");
}

/** Silences everything, e.g. when leaving a page. */
export function hush(): void {
  generation += 1;
  stopSpeaking();
  mark(undefined);
}

/** Pill button: ▶ 播放 or 🐢 慢速. Plays every line of `lines` in turn. */
export function playButton(lines: Jp | Jp[], kind: "normal" | "slow" = "normal", extra = ""): HTMLButtonElement {
  const all = Array.isArray(lines) ? lines : [lines];
  const slow = kind === "slow";
  const button = h(
    "button",
    {
      type: "button",
      class: `inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-5 text-lg font-bold transition active:scale-95 ${
        slow ? "bg-card text-ai ring-2 ring-ai/40" : "bg-ai-soft text-ai"
      } ${extra}`,
      "aria-label": `${slow ? "慢速播放" : "播放"}「${all.map(plain).join("")}」`,
    },
    icon(slow ? "slow" : "speaker", "h-6 w-6"),
    slow ? "慢速" : "播放",
  );
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    void playAll(all, button, slow ? SLOW_RATE : undefined);
  });
  return button;
}
