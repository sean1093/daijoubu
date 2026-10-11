/**
 * 旅遊小抄: short step-by-step guides for procedures that trip travellers up.
 * Like the emergency numbers, every guide names its sources and the date it
 * was checked, and tests/content.test.ts refuses one without them. A rule
 * that could not be confirmed is left out, and the guide says to ask staff.
 *
 * Checked 2026-10-11. The official sites were not reachable from the build
 * environment, so the rules were read from the official leaflets and from
 * search results quoting these official pages. Re-check before each release
 * season.
 */
export interface GuideStep {
  title: string;
  body: string;
}

export interface Guide {
  /** Kebab-case; the page is `#/guide/<id>`. */
  id: string;
  title: string;
  /** One line under the title on the home list. */
  summary: string;
  steps: GuideStep[];
  /** Things that go wrong, in plain words. */
  notes: string[];
  sources: string[];
  verified: string;
}

export const GUIDES: Guide[] = [
  {
    id: "tax-refund",
    title: "出境退稅新制",
    summary: "2026 年 11 月 1 日起買的東西，先付含稅價，出境時在機場確認後才退稅。",
    steps: [
      {
        title: "在店裡",
        body: "結帳時出示護照，付含稅的價錢。順便問店員稅金之後怎麼退：會由店家或合作的業者，照你登記的方式退回。",
      },
      {
        title: "出發去機場前",
        body: "把護照和全部的免稅品放在好拿的地方。同一張收據上的東西要全部帶著。想用手機辦的話，先在 Visit Japan Web 設定好。",
      },
      {
        title: "到機場，報到托運之前",
        body: "在國際線出境大廳的退稅機台刷護照。成田、羽田、關西、中部、福岡、新千歲、那霸也可以連機場的退稅 Wi-Fi，用 Visit Japan Web 在手機上辦；人一定要在機場，不能在飯店先辦。手機辦不成就改用機台。",
      },
      {
        title: "看結果的顏色",
        body: "綠色：辦好了，不用給海關檢查。紅色：到出境大廳的海關檢查處，把免稅品拿給海關看。",
      },
      {
        title: "辦完再去報到",
        body: "免稅品這時候要托運或手提都可以。稅金之後照你在店裡登記的方式退回。",
      },
    ],
    notes: [
      "同一張收據上的東西少一件沒帶，整張收據都不能退稅。",
      "還沒辦完就托運行李，就失去退稅資格，航空公司也不會幫你把行李拿回來。",
      "還沒給海關確認就用宅配寄走的東西，不能退稅。",
      "已經用掉、或沒帶在身上的東西，辦手續前先告訴海關人員。",
      "排隊可能要一段時間，請提早到機場。自己趕時間中途放棄，算沒辦完。",
      "先搭日本國內線再轉國際線：免稅品不要直掛，到國際線出境的機場再辦。",
      "10 月 31 日以前買的照舊制，在店裡就直接免稅。",
      "退款方式和手續費各店不同，以店家的說明為準。",
    ],
    sources: [
      // Steps and notes: the official zh-TW leaflet 「外國人旅客免稅（退稅）手續指南」 by the Japan Tourism
      // Agency, National Tax Agency and Japan Customs (shared by the owner, 2026-10-11), and the JTA page:
      // refund model from purchases on 2026-11-01, passport at a kiosk within 90 days.
      "https://www.mlit.go.jp/kankocho/tax-free/page01_000001_00021.html",
      // Japan Customs: co-issuer of the leaflet; confirms goods at departure.
      "https://www.customs.go.jp/",
      // Chubu Centrair: once baggage is checked in, the procedure is no longer possible.
      "https://www.centrair.jp/taxrefund/",
    ],
    verified: "2026-10-11",
  },
];

export function guideById(id: string | undefined): Guide | undefined {
  return GUIDES.find((guide) => guide.id === id);
}
