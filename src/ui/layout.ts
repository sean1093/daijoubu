import { fill, h, icon, type Child } from "./dom";

/**
 * A page with a big "back" button and a title. Every page is one step from
 * home, so back always goes home unless `back` says otherwise.
 */
export function page(root: HTMLElement, title: string, body: Child[], options: { back?: string; backLabel?: string } = {}): void {
  fill(
    root,
    h(
      "header",
      { class: "pt-safe no-print sticky top-0 z-10 flex items-center gap-2 bg-paper/95 px-3 pb-2 backdrop-blur" },
      h(
        "a",
        {
          href: options.back ?? "#/",
          class: "inline-flex min-h-14 shrink-0 items-center gap-1 rounded-lg bg-card px-4 text-lg font-bold text-ai ring-1 ring-hair active:scale-95",
        },
        icon("back", "h-6 w-6"),
        options.backLabel ?? "回首頁",
      ),
      h("h1", { class: "min-w-0 flex-1 truncate text-right text-2xl font-bold" }, title),
    ),
    h("main", { class: "px-4 pb-16" }, body),
  );
}

/**
 * A section title in the style of a platform sign: a short bar of the
 * accent colour, then the words. Plain enough to read at a glance.
 */
export function heading(text: string, tone: "ai" | "shu" = "ai"): HTMLElement {
  return h(
    "h2",
    { class: "mb-2 flex items-center gap-2 text-lg font-bold text-ink" },
    h("span", { class: `h-5 w-1.5 rounded-full ${tone === "shu" ? "bg-shu" : "bg-ai"}`, "aria-hidden": "true" }),
    text,
  );
}

/** A titled group of content. */
export function section(title: string | null, ...children: Child[]): HTMLElement {
  return h("section", { class: "mt-6" }, title && heading(title), children);
}

/**
 * Actions docked at the bottom of the screen, reachable from anywhere on a
 * long page, plus the spacer that keeps the dock from covering the last
 * line. Put both at the end of the page body.
 */
export function dock(label: string, ...children: Child[]): HTMLElement[] {
  return [
    h("div", { class: "h-24", "aria-hidden": "true" }),
    h(
      "nav",
      { class: "pb-safe fixed inset-x-0 bottom-0 z-20 border-t-2 border-hair bg-paper/95 backdrop-blur", "aria-label": label },
      h("div", { class: "mx-auto max-w-xl px-4 pt-2" }, children),
    ),
  ];
}
