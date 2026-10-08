import type { Scene } from "../types";

const OK = { jp: "はい。", zh: "好" };

export default {
  id: "restaurant",
  title: "餐廳",
  icon: "🍜",
  phrases: [
    {
      id: "restaurant-allergy",
      zh: "我有過敏，請看這張卡。",
      jp: "アレルギー が あります。この カード を {見|み}て ください。",
      link: { href: "#/medical", label: "打開過敏卡" },
    },
    { id: "restaurant-one", zh: "一位。", jp: "{一人|ひとり} です。" },
    { id: "restaurant-two", zh: "兩位。", jp: "{二人|ふたり} です。" },
    {
      id: "restaurant-seat-free",
      zh: "有位子嗎？",
      jp: "{席|せき} は {空|あ}いて います か。",
      answers: [
        { jp: "はい、どうぞ", zh: "有，請進" },
        { jp: "{少|すこ}し お{待|ま}ち ください", zh: "請稍等一下" },
        { jp: "{満席|まんせき} です", zh: "客滿了" },
      ],
    },
    { id: "restaurant-wait", zh: "要等多久？", jp: "どのくらい {待|ま}ちます か。", answers: "time" },
    { id: "restaurant-no-reservation", zh: "我沒有預約。", jp: "{予約|よやく} は して いません。" },
    { id: "restaurant-menu", zh: "請給我菜單。", jp: "メニュー を ください。" },
    {
      id: "restaurant-chinese-menu",
      zh: "有中文菜單嗎？",
      jp: "{中国語|ちゅうごくご} の メニュー は あります か。",
      answers: "yesNo",
    },
    { id: "restaurant-this", zh: "我要這個。（指著菜單）", jp: "これ を ください。" },
    { id: "restaurant-same", zh: "我要跟那個一樣的。", jp: "あれ と {同|おな}じ もの を ください。" },
    { id: "restaurant-recommend", zh: "推薦哪一道？", jp: "おすすめ は どれ です か。" },
    {
      id: "restaurant-meat",
      zh: "這道菜有肉嗎？",
      jp: "この {料理|りょうり} に {肉|にく} は {入|はい}って います か。",
      answers: "yesNo",
    },
    {
      id: "restaurant-vegetarian-dish",
      zh: "有素食的料理嗎？",
      jp: "ベジタリアン {向|む}け の {料理|りょうり} は あります か。",
      answers: "yesNo",
    },
    {
      id: "restaurant-dashi",
      zh: "湯頭（高湯）有用魚或肉熬的嗎？",
      jp: "だし に {魚|さかな} や {肉|にく} は {使|つか}って います か。",
      tip: "日本料理的湯和醬汁常用柴魚高湯（だし），吃素的人要特別問。",
      answers: "yesNo",
    },
    { id: "restaurant-not-spicy", zh: "請不要做辣的。", jp: "{辛|から}く しないで ください。" },
    {
      id: "restaurant-small",
      zh: "份量可以少一點嗎？",
      jp: "{量|りょう} を {少|すく}なめ に できます か。",
      answers: "yesNo",
    },
    { id: "restaurant-water", zh: "請給我開水。", jp: "お{水|みず} を ください。" },
    {
      id: "restaurant-ticket-machine",
      zh: "我不會用點餐機（買餐券的機器）。",
      jp: "{食券機|しょっけんき} の {使|つか}い{方|かた} が わかりません。",
    },
    { id: "restaurant-takeout", zh: "可以外帶嗎？", jp: "{持|も}ち{帰|かえ}り できます か。", answers: "yesNo" },
    { id: "restaurant-bill", zh: "我要結帳。", jp: "お{会計|かいけい} を お{願|ねが}い します。" },
    { id: "restaurant-card", zh: "可以刷卡嗎？", jp: "カード で {払|はら}えます か。", answers: "yesNo" },
    {
      id: "restaurant-thanks",
      zh: "很好吃，謝謝招待。",
      jp: "とても おいしかった です。ごちそうさま でした。",
    },
  ],
  heard: [
    {
      id: "restaurant-heard-how-many",
      jp: "{何名|なんめい} {様|さま} です か。",
      zh: "請問幾位？",
      replies: [
        { jp: "{一人|ひとり} です。", zh: "1 位" },
        { jp: "{二人|ふたり} です。", zh: "2 位" },
        { jp: "{三人|さんにん} です。", zh: "3 位" },
      ],
    },
    {
      id: "restaurant-heard-eat-in",
      jp: "{店内|てんない} で お{召|め}し{上|あ}がり です か。",
      zh: "內用嗎？",
      replies: [
        { jp: "はい、{店内|てんない} で。", zh: "內用" },
        { jp: "{持|も}ち{帰|かえ}り で。", zh: "外帶" },
      ],
    },
    {
      id: "restaurant-heard-ready",
      jp: "ご{注文|ちゅうもん} は お{決|き}まり です か。",
      zh: "決定好要點什麼了嗎？",
      replies: [
        { jp: "これ を ください。", zh: "我要這個（指著菜單）" },
        { jp: "もう {少|すこ}し {待|ま}って ください。", zh: "請再等一下" },
      ],
    },
    {
      id: "restaurant-heard-drink",
      jp: "お{飲|の}み{物|もの} は いかが です か。",
      zh: "要喝點什麼嗎？",
      replies: [
        { jp: "お{水|みず} で {大丈夫|だいじょうぶ} です。", zh: "開水就好" },
        { jp: "お{茶|ちゃ} を ください。", zh: "請給我茶" },
        { jp: "{結構|けっこう} です。", zh: "不用了" },
      ],
    },
    {
      id: "restaurant-heard-wait",
      jp: "{少々|しょうしょう} お{待|ま}ち ください。",
      zh: "請稍等。",
      replies: [OK, { jp: "どのくらい です か。", zh: "要等多久？" }],
    },
    {
      id: "restaurant-heard-ticket",
      jp: "{先|さき} に {食券|しょっけん} を {買|か}って ください。",
      zh: "請先在機器買餐券。",
      replies: [OK, { jp: "{買|か}い{方|かた} を {教|おし}えて ください。", zh: "請教我怎麼買" }],
    },
    {
      id: "restaurant-heard-together",
      jp: "お{会計|かいけい} は ご{一緒|いっしょ} です か。",
      zh: "要一起結帳嗎？",
      replies: [
        { jp: "{一緒|いっしょ} で お{願|ねが}い します。", zh: "一起" },
        { jp: "{別々|べつべつ} で お{願|ねが}い します。", zh: "分開" },
      ],
    },
  ],
} satisfies Scene;
