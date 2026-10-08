import type { Phrase } from "./types";

/** 萬用救援句: on top of every scene, for when a conversation gets stuck. */
export const RESCUE: Phrase[] = [
  { id: "rescue-excuse-me", zh: "不好意思（叫住對方）", jp: "すみません。" },
  { id: "rescue-no-japanese", zh: "我不會說日文。", jp: "{日本語|にほんご} が {話|はな}せません。" },
  { id: "rescue-yes-no", zh: "請用「是」或「不是」回答我。", jp: "はい か いいえ で {答|こた}えて ください。" },
  { id: "rescue-write", zh: "請寫在紙上。", jp: "{紙|かみ} に {書|か}いて ください。" },
  { id: "rescue-slowly", zh: "請說慢一點。", jp: "ゆっくり {話|はな}して ください。" },
  { id: "rescue-again", zh: "請再說一次。", jp: "もう {一度|いちど} お{願|ねが}い します。" },
  { id: "rescue-point", zh: "請指給我看。", jp: "{指|ゆび}さして ください。" },
  { id: "rescue-wait", zh: "請等一下。", jp: "ちょっと {待|ま}って ください。" },
  { id: "rescue-thanks", zh: "謝謝。", jp: "ありがとう ございます。" },
];
