import type { Jp } from "../content/types";
import { userWord } from "../lib/jp";
import { dialable } from "../lib/phone";
import { type Contact, currentHotel, type Hotel, type Place, type Profile } from "./profile";

/**
 * The cards built from the saved profile — shown on screen, read aloud and
 * printed. Japanese for the person helping, Chinese in small print for the
 * traveller. Pure data, so tests can check every sentence.
 */
export interface CardBlock {
  jp: Jp;
  zh: string;
  /** Lines shown as they are (names, addresses, numbers); never read aloud. */
  extra: string[];
}

export const LINES = {
  sorry: "すみません。{日本語|にほんご} が {話|はな}せません。",
  fromTaiwan: "{台湾|たいわん} から {来|き}た {旅行者|りょこうしゃ} です。",
  lost: "{道|みち} に {迷|まよ}って しまいました。{助|たす}けて ください。",
  backToHotel: "この ホテル に {帰|かえ}りたい です。{行|い}き{方|かた} を {教|おし}えて ください。",
  taxiToHotel: "この ホテル まで お{願|ねが}い します。",
  callFamily: "{家族|かぞく} に {電話|でんわ} を して いただけません か。",
  callLocal: "{日本|にほん} に いる {知|し}り{合|あ}い です。{電話|でんわ} を して いただけません か。",
  koban: "{近|ちか}く の {交番|こうばん} は どこ です か。",
  callPolice: "{警察|けいさつ} を {呼|よ}んで ください。",
} satisfies Record<string, Jp>;

/** Japanese for the name a phrase slot shows: 新宿 → 新宿駅 for a station when `withEki`. */
export function placeWord(place: Place, withEki: boolean): Jp {
  const base = place.name.replace(/駅$/, "");
  const kana = place.kana.replace(/えき$|エキ$/, "");
  const word = userWord(base, kana);
  if (!withEki || place.kind !== "station") return word;
  return `${word}{駅|えき}`;
}

export function hotelWord(hotel: Hotel): Jp {
  return userWord(hotel.name, hotel.kana);
}

/** Address and phone of a hotel, as lines for the card. */
export function hotelLines(hotel: Hotel): string[] {
  const phone = dialable(hotel.phone, "jp");
  return [hotel.name, hotel.address ? `〒 ${hotel.address}` : "", phone ? `TEL ${phone.display}` : ""].filter(Boolean);
}

/** A contact as lines a Japanese helper can dial from. */
export function contactLines(contact: Contact, home: "tw" | "jp"): string[] {
  const phone = dialable(contact.phone, home);
  const who = [contact.relation, contact.name].filter(Boolean).join("　");
  if (!phone) return [who].filter(Boolean);
  return [
    who,
    `TEL ${phone.display}`,
    // How a Japanese phone reaches a Taiwanese number: the helper will not know.
    phone.fromJapan ? `（日本の電話から：${phone.fromJapan}）` : "",
  ].filter(Boolean);
}

/** The "I need help" card: who I am, I'm lost, my hotel, call my family. */
export function helpCard(profile: Profile, day?: string): CardBlock[] {
  const blocks: CardBlock[] = [
    {
      jp: `${LINES.sorry} ${LINES.fromTaiwan}`,
      zh: "不好意思，我不會說日文。我是從台灣來的旅客。",
      extra: profile.passportName ? [`名前：${profile.passportName}`] : [],
    },
    { jp: LINES.lost, zh: "我迷路了，請幫幫我。", extra: [] },
  ];
  const hotel = currentHotel(profile, day);
  if (hotel) blocks.push({ jp: LINES.backToHotel, zh: "我想回這間飯店，請告訴我怎麼走。", extra: hotelLines(hotel) });
  const family = profile.contacts[0];
  if (family) blocks.push({ jp: LINES.callFamily, zh: "可以幫我打電話給家人嗎？", extra: contactLines(family, "tw") });
  if (profile.localContact.phone) {
    blocks.push({ jp: LINES.callLocal, zh: "可以幫我打這支電話嗎？這是我在日本的朋友。", extra: contactLines(profile.localContact, "jp") });
  }
  return blocks;
}

/** For a taxi driver or anyone giving directions. */
export function hotelCard(hotel: Hotel): CardBlock {
  return { jp: LINES.taxiToHotel, zh: "請載我到這間飯店。", extra: hotelLines(hotel) };
}
