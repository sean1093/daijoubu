import type { Scene } from "../types";

const OK = { jp: "わかりました。", zh: "知道了" };

export default {
  id: "hotel",
  title: "飯店",
  icon: "bed",
  phrases: [
    { id: "hotel-check-in", zh: "我要辦入住。", jp: "チェックイン を お{願|ねが}い します。" },
    {
      id: "hotel-reserved",
      zh: "我有預約，這是我的名字。",
      jp: "{予約|よやく} して います。{名前|なまえ} は これ です。",
      tip: "同時給對方看護照或訂房確認信。",
    },
    {
      id: "hotel-bags-before",
      zh: "入住前可以先寄放行李嗎？",
      jp: "チェックイン まで {荷物|にもつ} を {預|あず}かって もらえます か。",
      answers: "yesNo",
    },
    {
      id: "hotel-bags-after",
      zh: "退房後可以寄放行李嗎？",
      jp: "チェックアウト の {後|あと}、{荷物|にもつ} を {預|あず}かって もらえます か。",
      answers: "yesNo",
    },
    { id: "hotel-check-out", zh: "我要退房。", jp: "チェックアウト を お{願|ねが}い します。" },
    { id: "hotel-checkout-time", zh: "退房是幾點？", jp: "チェックアウト は {何時|なんじ} です か。" },
    { id: "hotel-breakfast-time", zh: "早餐幾點開始？", jp: "{朝食|ちょうしょく} は {何時|なんじ} から です か。" },
    {
      id: "hotel-breakfast-where",
      zh: "早餐在哪裡吃？",
      jp: "{朝食|ちょうしょく} の {会場|かいじょう} は どこ です か。",
      answers: "direction",
    },
    {
      id: "hotel-key-inside",
      zh: "我把房卡留在房間裡，進不去了。",
      jp: "カードキー を {部屋|へや} に {置|お}いた まま {出|で}て しまいました。",
    },
    { id: "hotel-key-lost", zh: "我的房卡不見了。", jp: "カードキー を なくしました。" },
    {
      id: "hotel-room-number",
      zh: "我忘了我的房號。",
      jp: "{部屋|へや} の {番号|ばんごう} を {忘|わす}れて しまいました。",
      tip: "同時給對方看護照。",
    },
    {
      id: "hotel-wifi",
      zh: "請告訴我 Wi-Fi 密碼。",
      jp: "{Wi-Fi|ワイファイ} の パスワード を {教|おし}えて ください。",
    },
    { id: "hotel-aircon", zh: "冷氣（暖氣）不能用。", jp: "エアコン が {動|うご}きません。" },
    { id: "hotel-hot-water", zh: "沒有熱水。", jp: "お{湯|ゆ} が {出|で}ません。" },
    { id: "hotel-towel", zh: "請再給我一條毛巾。", jp: "タオル を もう {一枚|いちまい} ください。" },
    {
      id: "hotel-call-taxi",
      zh: "可以幫我叫計程車嗎？",
      jp: "タクシー を {呼|よ}んで いただけます か。",
      answers: "yesNo",
    },
    {
      id: "hotel-konbini-near",
      zh: "附近有便利商店嗎？",
      jp: "{近|ちか}く に コンビニ は あります か。",
      answers: "place",
    },
  ],
  heard: [
    {
      id: "hotel-heard-passport",
      jp: "パスポート を お{願|ねが}い します。",
      zh: "請給我護照。",
      replies: [
        { jp: "はい、どうぞ。", zh: "好，給你" },
        { jp: "ちょっと {待|ま}って ください。", zh: "請等一下" },
      ],
    },
    {
      id: "hotel-heard-name",
      jp: "お{名前|なまえ} を お{願|ねが}い します。",
      zh: "請問您的名字？",
      replies: [
        { jp: "これ です。", zh: "這是我的名字（給對方看護照）" },
        { jp: "{予約|よやく} の {画面|がめん} を {見|み}せます。", zh: "我給你看訂房畫面" },
      ],
    },
    {
      id: "hotel-heard-fill-in",
      jp: "こちら に ご{記入|きにゅう} ください。",
      zh: "請填寫這裡。",
      replies: [
        { jp: "はい。", zh: "好" },
        { jp: "{書|か}き{方|かた} が わかりません。", zh: "我不知道怎麼寫" },
      ],
    },
    {
      id: "hotel-heard-check-in-time",
      jp: "チェックイン は {15時|じゅうごじ} から です。",
      zh: "下午 3 點開始才能入住。",
      replies: [
        { jp: "{荷物|にもつ} を {預|あず}かって もらえます か。", zh: "可以先寄放行李嗎？" },
        OK,
      ],
    },
    {
      id: "hotel-heard-tax",
      jp: "{宿泊税|しゅくはくぜい} が かかります。",
      zh: "要另外付住宿稅。",
      replies: [{ jp: "いくら です か。", zh: "多少錢？" }, OK],
    },
    {
      id: "hotel-heard-payment",
      jp: "お{支払|しはら}い は どう されます か。",
      zh: "要怎麼付錢？",
      replies: [
        { jp: "カード で お{願|ねが}い します。", zh: "刷卡" },
        { jp: "{現金|げんきん} で お{願|ねが}い します。", zh: "付現金" },
      ],
    },
  ],
} satisfies Scene;
