import type { Scene } from "../types";

const OK = { jp: "わかりました。", zh: "知道了" };

export default {
  id: "shopping",
  title: "購物",
  icon: "🛍️",
  phrases: [
    { id: "shopping-how-much", zh: "這個多少錢？", jp: "これ は いくら です か。" },
    { id: "shopping-this", zh: "我要這個。", jp: "これ を ください。" },
    { id: "shopping-just-looking", zh: "我只是看看。", jp: "{見|み}て いる だけ です。" },
    {
      id: "shopping-where-item",
      zh: "這個在哪裡？（給對方看照片）",
      jp: "これ は どこ に あります か。",
      answers: "direction",
    },
    { id: "shopping-try-on", zh: "可以試穿嗎？", jp: "{試着|しちゃく} して も いい です か。", answers: "yesNo" },
    {
      id: "shopping-bigger",
      zh: "有大一點的尺寸嗎？",
      jp: "もう {少|すこ}し {大|おお}きい サイズ は あります か。",
      answers: "yesNo",
    },
    {
      id: "shopping-smaller",
      zh: "有小一點的尺寸嗎？",
      jp: "もう {少|すこ}し {小|ちい}さい サイズ は あります か。",
      answers: "yesNo",
    },
    { id: "shopping-other-color", zh: "有別的顏色嗎？", jp: "{他|ほか} の {色|いろ} は あります か。", answers: "yesNo" },
    { id: "shopping-write-price", zh: "請把價錢寫下來。", jp: "{値段|ねだん} を {書|か}いて ください。" },
    {
      id: "shopping-tax-free",
      zh: "可以辦免稅嗎？",
      jp: "{免税|めんぜい} に できます か。",
      tip: "辦免稅要出示護照。",
      answers: "yesNo",
    },
    { id: "shopping-card", zh: "可以刷卡嗎？", jp: "カード で {払|はら}えます か。", answers: "yesNo" },
    {
      id: "shopping-gift-wrap",
      zh: "可以幫我包裝成禮物嗎？",
      jp: "プレゼント {用|よう} に {包|つつ}んで もらえます か。",
      answers: "yesNo",
    },
    { id: "shopping-bag", zh: "請給我袋子。", jp: "{袋|ふくろ} を ください。" },
    { id: "shopping-think", zh: "我再考慮一下。", jp: "{少|すこ}し {考|かんが}えます。" },
    {
      id: "shopping-exchange",
      zh: "這個可以換嗎？",
      jp: "これ を {交換|こうかん} して もらえます か。",
      tip: "同時給對方看收據。",
      answers: "yesNo",
    },
    {
      id: "shopping-return",
      zh: "我想退貨。",
      jp: "これ を {返品|へんぴん} したい です。",
      tip: "同時給對方看收據。",
    },
  ],
  heard: [
    {
      id: "shopping-heard-looking-for",
      jp: "{何|なに} か お{探|さが}し です か。",
      zh: "在找什麼嗎？",
      replies: [
        { jp: "{見|み}て いる だけ です。", zh: "只是看看" },
        { jp: "これ を {探|さが}して います。", zh: "我在找這個（給對方看照片）" },
      ],
    },
    {
      id: "shopping-heard-tax-free",
      jp: "{免税|めんぜい} の お{手続|てつづ}き を します か。",
      zh: "要辦免稅嗎？",
      replies: [
        { jp: "はい、お{願|ねが}い します。", zh: "要" },
        { jp: "いいえ、{大丈夫|だいじょうぶ} です。", zh: "不用" },
      ],
    },
    {
      id: "shopping-heard-passport",
      jp: "パスポート を お{願|ねが}い します。",
      zh: "請給我護照。",
      replies: [
        { jp: "はい、どうぞ。", zh: "好，給你" },
        { jp: "{今|いま} {持|も}って いません。", zh: "我現在沒帶" },
      ],
    },
    {
      id: "shopping-heard-paid-bag",
      jp: "{袋|ふくろ} は {有料|ゆうりょう} です が、よろしい です か。",
      zh: "袋子要另外付錢，可以嗎？",
      replies: [
        { jp: "はい、お{願|ねが}い します。", zh: "好，要袋子" },
        { jp: "いいえ、いりません。", zh: "不用袋子" },
      ],
    },
    {
      id: "shopping-heard-lump-sum",
      jp: "お{支払|しはら}い は {一括|いっかつ} で よろしい です か。",
      zh: "刷卡一次付清可以嗎？",
      replies: [
        { jp: "はい。", zh: "好" },
        { jp: "わかりません。", zh: "我不懂" },
      ],
    },
    {
      id: "shopping-heard-pin",
      jp: "{暗証番号|あんしょうばんごう} を {入力|にゅうりょく} して ください。",
      zh: "請輸入信用卡密碼。",
      replies: [
        { jp: "はい。", zh: "好" },
        { jp: "{暗証番号|あんしょうばんごう} が わかりません。", zh: "我不知道密碼" },
      ],
    },
    {
      id: "shopping-heard-sold-out",
      jp: "{申|もう}し{訳|わけ} ありません。{在庫|ざいこ} が ありません。",
      zh: "很抱歉，沒有庫存了。",
      replies: [OK, { jp: "{他|ほか} の {店|みせ} に あります か。", zh: "別家店有嗎？" }],
    },
  ],
} satisfies Scene;
