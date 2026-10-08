import type { Scene } from "../types";

const SEE_CARD = { jp: "この カード を {見|み}て ください。", zh: "請看這張卡（醫療卡）" };

/** 緊急・醫療. The medical and allergy cards themselves live on #/medical. */
export default {
  id: "emergency",
  title: "緊急・醫療",
  icon: "🚑",
  phrases: [
    { id: "emergency-help", zh: "救命！請幫幫我！", jp: "{助|たす}けて ください！" },
    { id: "emergency-ambulance", zh: "請幫我叫救護車。", jp: "{救急車|きゅうきゅうしゃ} を {呼|よ}んで ください。" },
    { id: "emergency-police", zh: "請幫我叫警察。", jp: "{警察|けいさつ} を {呼|よ}んで ください。" },
    { id: "emergency-unwell", zh: "我身體不舒服。", jp: "{気分|きぶん} が {悪|わる}い です。" },
    {
      id: "emergency-medical-card",
      zh: "這是我的醫療資料，請看這張卡。",
      jp: "{私|わたし} の {医療|いりょう} {情報|じょうほう} です。この カード を {見|み}て ください。",
      link: { href: "#/medical", label: "打開醫療卡" },
    },
    { id: "emergency-to-hospital", zh: "請帶我去醫院。", jp: "{病院|びょういん} に {連|つ}れて {行|い}って ください。" },
    {
      id: "emergency-hospital-near",
      zh: "附近的醫院在哪裡？",
      jp: "{近|ちか}く の {病院|びょういん} は どこ です か。",
      answers: "direction",
    },
    {
      id: "emergency-pharmacy-near",
      zh: "附近有藥局嗎？",
      jp: "{近|ちか}く に {薬局|やっきょく} は あります か。",
      answers: "place",
    },
    {
      id: "emergency-insurance",
      zh: "我有保旅遊保險。",
      jp: "{海外旅行|かいがいりょこう} {保険|ほけん} に {入|はい}って います。",
    },
    {
      id: "emergency-chinese-doctor",
      zh: "有會說中文的醫生嗎？",
      jp: "{中国語|ちゅうごくご} が {話|はな}せる {医師|いし} は います か。",
      answers: "yesNo",
    },
    { id: "emergency-cost", zh: "費用大約多少？", jp: "{費用|ひよう} は いくら ぐらい です か。" },
    {
      id: "emergency-documents",
      zh: "請給我診斷書和收據（保險理賠要用）。",
      jp: "{保険|ほけん} の ため に {診断書|しんだんしょ} と {領収書|りょうしゅうしょ} を ください。",
    },
    { id: "emergency-stolen", zh: "我的東西被偷了。", jp: "{物|もの} を {盗|ぬす}まれました。" },
    { id: "emergency-lost-wallet", zh: "我的錢包掉了。", jp: "{財布|さいふ} を なくしました。" },
    { id: "emergency-lost-passport", zh: "我的護照掉了。", jp: "パスポート を なくしました。" },
    {
      id: "emergency-evacuate",
      zh: "（地震、颱風時）要去哪裡避難？",
      jp: "どこ に {避難|ひなん} すれば いい です か。",
      answers: "direction",
    },
  ],
  heard: [
    {
      id: "emergency-heard-where-hurts",
      jp: "どこ が {痛|いた}い です か。",
      zh: "哪裡痛？",
      replies: [
        { jp: "{頭|あたま} です。", zh: "頭" },
        { jp: "{胸|むね} です。", zh: "胸口" },
        { jp: "お{腹|なか} です。", zh: "肚子" },
        { jp: "{足|あし} です。", zh: "腳" },
        { jp: "{腰|こし} です。", zh: "腰" },
      ],
    },
    {
      id: "emergency-heard-since",
      jp: "いつ から です か。",
      zh: "從什麼時候開始的？",
      replies: [
        { jp: "さっき から です。", zh: "剛剛" },
        { jp: "{今朝|けさ} から です。", zh: "今天早上" },
        { jp: "{昨日|きのう} から です。", zh: "昨天" },
      ],
    },
    {
      id: "emergency-heard-insurance",
      jp: "{保険|ほけん} は あります か。",
      zh: "有保險嗎？",
      replies: [
        { jp: "{海外旅行|かいがいりょこう} {保険|ほけん} が あります。", zh: "有旅遊保險" },
        { jp: "ありません。", zh: "沒有" },
      ],
    },
    {
      id: "emergency-heard-allergy",
      jp: "アレルギー は あります か。",
      zh: "有過敏嗎？",
      replies: [{ jp: "ありません。", zh: "沒有" }, SEE_CARD],
    },
    {
      id: "emergency-heard-meds",
      jp: "{普段|ふだん} {飲|の}んで いる {薬|くすり} は あります か。",
      zh: "平常有在吃藥嗎？",
      replies: [{ jp: "ありません。", zh: "沒有" }, SEE_CARD],
    },
    {
      id: "emergency-heard-family",
      jp: "ご{家族|かぞく} の {連絡先|れんらくさき} を {教|おし}えて ください。",
      zh: "請告訴我家人的聯絡方式。",
      replies: [
        { jp: "この {画面|がめん} を {見|み}て ください。", zh: "請看這個畫面（打開求救卡）" },
        { jp: "{家族|かぞく} は {日本|にほん} に いません。", zh: "家人不在日本" },
      ],
    },
  ],
} satisfies Scene;
