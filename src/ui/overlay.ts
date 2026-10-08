import type { Jp, Reply } from "../content/types";
import { plain } from "../lib/jp";
import { BUTTON, h, icon } from "./dom";
import { hush, play, playAll, playButton } from "./japanese";

/** Marks the history entry an overlay pushes, so the back button closes it. */
const STATE_KEY = "daijoubuOverlay";

/**
 * A full-screen layer over the current page (from Ippo's showToClerk). It
 * pushes a history entry, so the phone's back button closes the layer
 * instead of leaving the page; leaving the page closes it too.
 */
export function openOverlay(label: string, build: (close: () => void) => HTMLElement): () => void {
  const overlay = h("div", {
    class: "fixed inset-0 z-50 flex flex-col bg-paper text-ink",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": label,
  });
  let open = true;

  function teardown(): void {
    if (!open) return;
    open = false;
    hush();
    overlay.remove();
    document.body.classList.remove("overflow-hidden");
    document.removeEventListener("keydown", onKey);
    window.removeEventListener("popstate", onPop);
    window.removeEventListener("hashchange", teardown);
    returnFocus?.focus({ preventScroll: true });
  }
  /** Closed from inside: drop the history entry we pushed, which fires popstate → teardown. */
  function close(): void {
    if (!open) return;
    if ((history.state as Record<string, unknown> | null)?.[STATE_KEY]) history.back();
    else teardown();
  }
  function onPop(): void {
    teardown();
  }
  function onKey(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      close();
      return;
    }
    if (event.key !== "Tab") return;
    // The page underneath is only covered: keep the focus ring inside the layer.
    const stops = [...overlay.querySelectorAll<HTMLElement>("button, a[href]")];
    const edge = event.shiftKey ? stops[0] : stops.at(-1);
    if (document.activeElement === edge || !overlay.contains(document.activeElement)) {
      event.preventDefault();
      (event.shiftKey ? stops.at(-1) : stops[0])?.focus();
    }
  }

  const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  overlay.append(build(close));
  history.pushState({ [STATE_KEY]: true }, "");
  window.addEventListener("popstate", onPop);
  window.addEventListener("hashchange", teardown);
  document.addEventListener("keydown", onKey);
  document.body.classList.add("overflow-hidden");
  document.body.append(overlay);
  overlay.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true });
  return close;
}

/**
 * Font size for Japanese shown at arm's length: a short phrase fills the
 * screen, a long one stays readable. Both axes are capped, so turning the
 * phone sideways enlarges the text and never clips it.
 */
export function armsLength(text: string): string {
  const n = text.length;
  const vw = n <= 6 ? 15 : n <= 12 ? 11 : n <= 20 ? 8.5 : n <= 32 ? 7 : 6;
  return `font-size: clamp(1.5rem, min(${vw}vw, ${vw * 1.5}vh), 5rem)`;
}

function closeButton(close: () => void): HTMLElement {
  return h(
    "button",
    {
      type: "button",
      class: "inline-flex min-h-14 items-center gap-2 rounded-full px-4 text-lg font-bold text-muted active:bg-hair",
      onclick: close,
      "data-autofocus": "",
    },
    icon("close", "h-7 w-7"),
    "關閉",
  );
}

export interface ShowBlock {
  jp: Jp;
  /** Chinese in small print, for the traveller holding the phone. */
  zh?: string;
  /** Extra lines shown as they are: an address, a phone number. */
  extra?: string[];
}

/**
 * 給對方看: plain Japanese as large as the screen allows, without ruby or
 * romaji — the person reading it is Japanese.
 */
export function showToOther(blocks: ShowBlock[], label = "給對方看", speakNow = false): void {
  if (speakNow) void playAll(blocks.map((b) => b.jp));
  openOverlay(label, (close) => {
    const many = blocks.length > 1;
    const total = blocks.map((b) => plain(b.jp)).join("");
    return h(
      "div",
      { class: "flex min-h-0 flex-1 flex-col" },
      h("div", { class: "pt-safe flex justify-end px-3" }, closeButton(close)),
      h(
        "div",
        {
          class: `flex min-h-0 flex-1 flex-col ${many ? "justify-start" : "justify-center"} gap-6 overflow-y-auto px-5 py-2 text-center`,
        },
        blocks.map((block) =>
          h(
            "div",
            null,
            h(
              "p",
              { lang: "ja", class: "font-bold leading-snug", style: armsLength(many ? total : plain(block.jp)) },
              plain(block.jp),
            ),
            block.extra?.map((line) =>
              h("p", { lang: "ja", class: "mt-2 break-words text-3xl font-bold leading-snug" }, line),
            ),
            block.zh && h("p", { class: "mt-2 text-lg text-muted" }, block.zh),
          ),
        ),
      ),
      // One row, so a phone held sideways still shows the actions.
      h(
        "div",
        { class: "pb-safe flex items-center justify-center gap-3 px-5 pt-3" },
        playButton(blocks.map((b) => b.jp)),
        playButton(
          blocks.map((b) => b.jp),
          "slow",
        ),
      ),
    );
  });
}

/** Asks the person in front of you to tap one of `replies`. */
const TAP_PLEASE: Jp = "{下|した} の {答|こた}え を {指|ゆび} で {押|お}して ください。";

/**
 * 給對方點選: the question in Japanese on top, Japanese answers to tap
 * below; once tapped, the traveller sees the answer in Chinese.
 */
export function askOther(question: { jp: Jp; zh: string }, replies: Reply[]): void {
  openOverlay("給對方點選", (close) => {
    const root = h("div", { class: "flex min-h-0 flex-1 flex-col" });

    function asking(): void {
      const options = replies.map((reply) =>
        h(
          "button",
          {
            type: "button",
            lang: "ja",
            class:
              "min-h-16 rounded-2xl bg-card px-3 py-3 text-2xl font-bold text-ink ring-2 ring-ai/50 transition active:scale-95 active:bg-ai-soft",
            onclick: () => answered(reply),
          },
          plain(reply.jp),
        ),
      );
      root.replaceChildren(
        h("div", { class: "pt-safe flex justify-end px-3" }, closeButton(close)),
        h(
          "div",
          { class: "min-h-0 flex-1 overflow-y-auto px-5 pb-safe" },
          h("p", { lang: "ja", class: "text-center font-bold leading-snug", style: armsLength(plain(question.jp)) }, plain(question.jp)),
          h("p", { class: "mt-1 text-center text-base text-muted" }, `（${question.zh}）`),
          h("p", { lang: "ja", class: "mt-4 rounded-xl bg-ai-soft px-3 py-2 text-center text-lg font-bold text-ai" }, plain(TAP_PLEASE)),
          h("div", { class: `mt-4 grid gap-3 ${replies.length > 4 ? "grid-cols-2" : "grid-cols-1"}` }, options),
        ),
      );
      void play(`${question.jp} ${TAP_PLEASE}`);
    }

    function answered(reply: Reply): void {
      hush();
      root.replaceChildren(
        h("div", { class: "pt-safe flex justify-end px-3" }, closeButton(close)),
        h(
          "div",
          { class: "flex min-h-0 flex-1 flex-col items-center justify-center gap-3 overflow-y-auto px-5 text-center" },
          h("p", { class: "text-lg text-muted" }, "對方的回答"),
          h("p", { class: "font-bold leading-tight", style: armsLength(reply.zh) }, reply.zh),
          h("p", { lang: "ja", class: "text-2xl text-muted" }, plain(reply.jp)),
        ),
        h(
          "div",
          { class: "pb-safe grid grid-cols-2 gap-3 px-5 pt-3" },
          h("button", { type: "button", class: BUTTON.secondary, onclick: asking }, "再問一次"),
          h("button", { type: "button", class: BUTTON.primary, onclick: close }, "好，知道了"),
        ),
      );
      root.querySelector<HTMLElement>("button.bg-ai")?.focus({ preventScroll: true });
    }

    asking();
    return root;
  });
}
