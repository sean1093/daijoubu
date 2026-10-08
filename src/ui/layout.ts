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
          class: "inline-flex min-h-14 shrink-0 items-center gap-1 rounded-full bg-card px-4 text-lg font-bold text-ai ring-2 ring-hair active:scale-95",
        },
        icon("back", "h-6 w-6"),
        options.backLabel ?? "回首頁",
      ),
      h("h1", { class: "min-w-0 flex-1 truncate text-right text-2xl font-bold" }, title),
    ),
    h("main", { class: "px-4 pb-16" }, body),
  );
}

/** A titled group of content. */
export function section(title: string | null, ...children: Child[]): HTMLElement {
  return h("section", { class: "mt-6" }, title && h("h2", { class: "mb-2 text-xl font-bold text-muted" }, title), children);
}
