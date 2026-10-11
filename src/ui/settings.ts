import { japaneseVoices, voiceStatus } from "../lib/speech";
import { settings, saveSettings, type TextSize, type Theme } from "../state";
import { h } from "./dom";
import { playButton } from "./japanese";
import { page, section } from "./layout";
import { voiceHelp } from "./voice-help";

/** Big buttons for one choice; the chosen one is filled. */
function choice<T extends string>(options: [T, string][], current: T, pick: (value: T) => void): HTMLElement {
  return h(
    "div",
    { class: `grid gap-3 ${options.length > 2 ? "grid-cols-3" : "grid-cols-2"}`, role: "radiogroup" },
    options.map(([value, label]) =>
      h(
        "button",
        {
          type: "button",
          role: "radio",
          "aria-checked": String(value === current),
          class: `min-h-16 rounded-xl px-2 text-xl font-bold ring-2 transition active:scale-95 ${
            value === current ? "bg-ai text-on-accent ring-ai" : "bg-card text-ink ring-hair"
          }`,
          onclick: () => pick(value),
        },
        label,
      ),
    ),
  );
}

export function renderSettings(root: HTMLElement): void {
  const rerender = () => renderSettings(root);
  const voices = japaneseVoices();
  const status = voiceStatus();
  page(root, "字體與聲音", [
    section(
      "字體大小",
      choice<TextSize>(
        [
          ["large", "大"],
          ["xlarge", "特大"],
        ],
        settings.textSize,
        (value) => {
          settings.textSize = value;
          saveSettings();
          rerender();
        },
      ),
    ),
    section(
      "顏色",
      choice<Theme>(
        [
          ["system", "跟手機"],
          ["light", "淺色"],
          ["dark", "深色"],
        ],
        settings.theme,
        (value) => {
          settings.theme = value;
          saveSettings();
          rerender();
        },
      ),
    ),
    section(
      "日文語音",
      status === "ok"
        ? h(
            "div",
            { class: "space-y-3" },
            voices.length > 1 &&
              h(
                "label",
                { class: "block text-lg" },
                "選擇聲音",
                h(
                  "select",
                  {
                    class: "mt-1 block min-h-14 w-full rounded-xl bg-card px-3 text-lg ring-1 ring-hair",
                    onchange: (event: Event) => {
                      const value = (event.target as HTMLSelectElement).value;
                      settings.voice = value || null;
                      saveSettings();
                    },
                  },
                  h("option", { value: "" }, "自動（音質最好的）"),
                  voices.map((voice) =>
                    h("option", { value: voice.voiceURI, selected: voice.voiceURI === settings.voice }, voice.name),
                  ),
                ),
              ),
            h("div", { class: "flex gap-3" }, playButton("こんにちは。 ありがとう ございます。"), playButton("こんにちは。", "slow")),
          )
        : h(
            "p",
            { class: "rounded-xl bg-warn-soft p-4 text-lg" },
            status === "unsupported" ? "這個瀏覽器不能念日文。" : "這支手機還沒有日文語音。",
            "「給對方看」一樣可以用。",
          ),
      h("div", { class: "mt-4" }, voiceHelp(status !== "ok")),
    ),
    section(
      null,
      h(
        "p",
        { class: "text-base text-muted" },
        "日本旅遊小幫手 (Daijoubu)。所有資料只存在這支手機裡，不會上傳。",
      ),
    ),
  ]);
}
