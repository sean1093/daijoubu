import type { Line } from "../profile/cards";
import { h } from "./dom";

/**
 * One extra line of a card. A phone number may wrap after "TEL" but never
 * inside the number, and shrinks on narrow screens rather than break.
 */
export function lineNode(line: Line, cls = ""): HTMLElement {
  if (typeof line === "string") return h("p", { class: `break-words ${cls}` }, line);
  return h(
    "p",
    { class: cls },
    "TEL ",
    h("span", { class: "inline-block whitespace-nowrap text-[min(1em,7.5vw)]" }, line.phone),
  );
}
