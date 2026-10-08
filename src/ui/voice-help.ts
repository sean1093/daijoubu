import { h } from "./dom";

/** What to do when nothing is heard (from Ippo's voice-help). */
export function voiceHelp(open: boolean): HTMLElement {
  const details = h(
    "details",
    { class: "rounded-2xl bg-card p-4 ring-2 ring-hair" },
    h("summary", { class: "cursor-pointer text-xl font-bold text-ai" }, "聽不到聲音？"),
    h(
      "ul",
      { class: "mt-3 list-disc space-y-2 pl-6 text-lg leading-relaxed" },
      h("li", null, "先確認音量已打開；iPhone 請關閉靜音模式（機身側邊的開關）。"),
      h("li", null, "iPhone／iPad：設定 → 輔助使用 → 朗讀內容 → 聲音 → 日文，下載一個語音（推薦「增強版」）。"),
      h("li", null, "Android：設定 → 系統 → 語言 → 文字轉語音輸出 → Google 語音服務，安裝日文語音資料。"),
      h("li", null, "完全沒有聲音，而且沒有語音可選：請改用 Safari 或 Chrome 開啟。"),
      h("li", null, "安裝後重新整理這個頁面。"),
      h("li", null, "沒有聲音也沒關係：按「給對方看」，把手機拿給對方看就好。"),
    ),
  );
  details.open = open;
  return details;
}
