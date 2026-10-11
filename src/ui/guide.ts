import { GUIDES, guideById } from "../content/guides";
import { h, icon } from "./dom";
import { heading, page, section } from "./layout";

/** One row per guide, for the home page: title and a one-line summary. */
export function guideRows(): HTMLElement {
  return h(
    "div",
    { class: "divide-y divide-dashed divide-hair overflow-hidden rounded-2xl bg-card" },
    GUIDES.map((guide) =>
      h(
        "a",
        {
          href: `#/guide/${guide.id}`,
          class: "flex min-h-16 items-center gap-3 px-4 py-3 transition-colors active:bg-ai-soft focus-visible:[outline-offset:-3px]",
        },
        h(
          "span",
          { class: "min-w-0 flex-1" },
          h("span", { class: "block text-xl font-semibold leading-snug" }, guide.title),
          h("span", { class: "mt-0.5 block text-base text-muted" }, guide.summary),
        ),
        icon("next", "h-6 w-6 shrink-0 text-ai"),
      ),
    ),
  );
}

/** `#/guide/<id>`: numbered steps, then what goes wrong, then where it comes from. */
export function renderGuide(root: HTMLElement, [id]: string[]): void {
  const guide = guideById(id);
  if (!guide) {
    location.replace("#/");
    return;
  }
  page(root, "旅遊小抄", [
    h("h2", { class: "mt-2 text-2xl font-bold leading-snug" }, guide.title),
    h("p", { class: "mt-2 text-lg leading-relaxed text-muted" }, guide.summary),
    h(
      "ol",
      { class: "mt-5 space-y-3" },
      guide.steps.map((step, i) =>
        h(
          "li",
          { class: "flex gap-3 rounded-2xl bg-card p-4" },
          h(
            "span",
            { class: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ai text-lg font-bold text-on-accent", "aria-hidden": "true" },
            String(i + 1),
          ),
          h(
            "div",
            { class: "min-w-0" },
            h("h3", { class: "text-xl font-semibold leading-snug" }, step.title),
            h("p", { class: "mt-1 text-lg leading-relaxed" }, step.body),
          ),
        ),
      ),
    ),
    guide.notes.length > 0 &&
      h(
        "section",
        { class: "mt-6 rounded-2xl bg-warn-soft p-4" },
        heading("注意", "shu"),
        h("ul", { class: "list-disc space-y-2 pl-6 text-lg leading-relaxed" }, guide.notes.map((note) => h("li", null, note))),
      ),
    section(
      null,
      h(
        "p",
        { class: "text-base text-muted" },
        `查證日期：${guide.verified}。來源：${guide.sources.map((url) => new URL(url).hostname).join("、")}。規定可能會改，以現場人員的說明為準。`,
      ),
    ),
  ]);
}
