import type { Reply, ReplySet } from "./types";

/** Every set ends with わかりません, so the other person is never forced to guess. */
const DONT_KNOW: Reply = { jp: "わかりません", zh: "不知道" };

/** 1番線 … 14番線, read as station announcements say them. */
const PLATFORM_KANA = [
  "いちばんせん",
  "にばんせん",
  "さんばんせん",
  "よんばんせん",
  "ごばんせん",
  "ろくばんせん",
  "ななばんせん",
  "はちばんせん",
  "きゅうばんせん",
  "じゅうばんせん",
  "じゅういちばんせん",
  "じゅうにばんせん",
  "じゅうさんばんせん",
  "じゅうよんばんせん",
];

/** Ready-made answers for "給對方點選", shared by many phrases. */
export const REPLY_SETS: Record<ReplySet, Reply[]> = {
  yesNo: [{ jp: "はい", zh: "是／對" }, { jp: "いいえ", zh: "不是／不對" }, DONT_KNOW],
  platform: [
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((n) => ({
      jp: `{${n}番線|${PLATFORM_KANA[n - 1]}}`,
      zh: `${n} 號月台`,
    })),
    DONT_KNOW,
  ],
  direction: [
    { jp: "{右|みぎ}", zh: "右邊 👉" },
    { jp: "{左|ひだり}", zh: "👈 左邊" },
    { jp: "まっすぐ", zh: "直走 👆" },
    { jp: "{後|うし}ろ", zh: "後面（往回走）" },
    { jp: "{上|うえ} の {階|かい}", zh: "樓上 ⬆️" },
    { jp: "{下|した} の {階|かい}", zh: "樓下 ⬇️" },
    { jp: "ここ です", zh: "就是這裡" },
    DONT_KNOW,
  ],
  time: [
    { jp: "すぐ です", zh: "馬上" },
    { jp: "{5分|ごふん} ぐらい", zh: "大約 5 分鐘" },
    { jp: "{10分|じゅっぷん} ぐらい", zh: "大約 10 分鐘" },
    { jp: "{30分|さんじゅっぷん} ぐらい", zh: "大約 30 分鐘" },
    { jp: "{1時間|いちじかん} ぐらい", zh: "大約 1 小時" },
    DONT_KNOW,
  ],
  place: [
    { jp: "この {近|ちか}く", zh: "就在附近" },
    { jp: "{遠|とお}い です", zh: "很遠" },
    { jp: "{駅|えき} の {中|なか}", zh: "在車站裡面" },
    { jp: "{駅|えき} の {外|そと}", zh: "在車站外面" },
    { jp: "ありません", zh: "沒有" },
    DONT_KNOW,
  ],
  // Exits are named by direction at most stations; numbered exits (A3…) vary too much to list,
  // so the other person can write the name instead.
  exit: [
    { jp: "{東口|ひがしぐち}", zh: "東口" },
    { jp: "{西口|にしぐち}", zh: "西口" },
    { jp: "{南口|みなみぐち}", zh: "南口" },
    { jp: "{北口|きたぐち}", zh: "北口" },
    { jp: "{中央口|ちゅうおうぐち}", zh: "中央口" },
    { jp: "{紙|かみ} に {書|か}きます", zh: "對方會寫給你看（請準備紙筆）" },
    DONT_KNOW,
  ],
};


export function repliesFor(answers: ReplySet | Reply[]): Reply[] {
  return Array.isArray(answers) ? answers : REPLY_SETS[answers];
}
