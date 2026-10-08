import { SCENES } from "../content/scenes";
import { voiceStatus } from "../lib/speech";
import { currentHotel, isEmpty, loadProfile } from "../profile/profile";
import { fill, h, icon } from "./dom";

const TILE =
  "flex min-h-28 flex-col items-center justify-center gap-1 rounded-3xl bg-card px-2 py-3 text-center text-2xl font-bold text-ink shadow-sm ring-2 ring-hair transition active:scale-95";

export function renderHome(root: HTMLElement): void {
  const profile = loadProfile();
  const hotel = currentHotel(profile);
  const greeting = profile.callName ? `${profile.callName}，有需要就按下面的按鈕` : "有需要就按下面的按鈕";
  fill(
    root,
    h(
      "main",
      { class: "pt-safe px-4 pb-10" },
      h("h1", { class: "mt-2 text-2xl font-bold leading-snug" }, greeting),
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
            "mt-4 flex min-h-36 items-center justify-center gap-3 rounded-3xl bg-shu px-4 py-5 text-on-accent shadow-md transition active:scale-[0.98]",
        },
        h("span", { class: "text-4xl", "aria-hidden": "true" }, "🆘"),
        h(
          "span",
          { class: "text-left" },
          h("span", { class: "block whitespace-nowrap text-[min(2rem,9vw)] font-bold leading-tight" }, "我需要幫忙"),
          h("span", { class: "block text-lg" }, "迷路・聯絡家人・緊急"),
        ),
      ),
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
        "div",
        { class: "mt-3 grid gap-3" },
        h(
          "a",
          { href: "#/hotel", class: `${TILE} min-h-20 flex-row gap-3` },
          h("span", { class: "text-4xl", "aria-hidden": "true" }, "🏨"),
          hotel ? "回飯店（給司機看）" : "回飯店",
        ),
        h(
          "a",
          { href: "#/medical", class: `${TILE} min-h-20 flex-row gap-3` },
          h("span", { class: "text-4xl", "aria-hidden": "true" }, "🩺"),
          "醫療卡・過敏卡",
        ),
      ),
      isEmpty(profile) &&
        h(
          "a",
          { href: "#/setup", class: "mt-6 block rounded-2xl bg-ai-soft p-4 text-lg leading-relaxed text-ink" },
          h("span", { class: "block text-xl font-bold text-ai" }, "還沒有你的資料"),
          "請點開分享給你的連結；或按這裡填寫飯店、行程和聯絡人，站名和地址就會自動帶進句子裡。",
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
