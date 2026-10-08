import { CONDITIONS, DIETS, DRUG_ALLERGIES, FOOD_ALLERGIES } from "../content/medical";
import type { Preset } from "../content/types";
import { plain } from "../lib/jp";
import {
  clearProfile,
  type Contact,
  emptyProfile,
  type Hotel,
  LIMITS,
  loadProfile,
  type Med,
  type Place,
  type Profile,
  parseProfile,
  saveProfile,
} from "../profile/profile";
import { BUTTON, fill, h, icon } from "./dom";
import { page, section } from "./layout";

const INPUT =
  "mt-1 block min-h-14 w-full rounded-xl bg-card px-3 py-2 text-xl text-ink ring-2 ring-hair placeholder:text-muted/80 focus:ring-ai";
const HINT = "mt-1 block text-base text-muted";
const CARD = "space-y-4 rounded-2xl bg-card/60 p-4 ring-2 ring-hair";

interface FieldOptions {
  hint?: string;
  placeholder?: string;
  /** "ja" for Japanese, so the phone offers a Japanese keyboard and font. */
  lang?: string;
  type?: string;
  inputmode?: string;
  max?: number;
  autocomplete?: string;
}

/** A labelled input that writes through `set` on every keystroke. */
function field(label: string, value: string, set: (value: string) => void, options: FieldOptions = {}): HTMLElement {
  return h(
    "label",
    { class: "block text-lg font-bold" },
    label,
    h("input", {
      class: INPUT,
      value,
      type: options.type ?? "text",
      lang: options.lang,
      inputmode: options.inputmode,
      placeholder: options.placeholder,
      maxlength: options.max ?? LIMITS.short,
      autocomplete: options.autocomplete ?? "off",
      oninput: (event: Event) => set((event.target as HTMLInputElement).value),
    }),
    options.hint && h("span", { class: `${HINT} font-normal` }, options.hint),
  );
}

/** Checkboxes for preset items, writing the checked ids through `set`. */
function presets(list: Preset[], chosen: string[], set: (ids: string[]) => void): HTMLElement {
  const picked = new Set(chosen);
  return h(
    "div",
    { class: "grid grid-cols-2 gap-2" },
    list.map((preset) =>
      h(
        "label",
        { class: "flex min-h-14 items-center gap-3 rounded-xl bg-card px-3 py-2 text-lg ring-2 ring-hair has-[:checked]:bg-ai-soft has-[:checked]:ring-ai" },
        h("input", {
          type: "checkbox",
          class: "h-6 w-6 shrink-0 accent-[rgb(var(--ai))]",
          checked: picked.has(preset.id),
          onchange: (event: Event) => {
            if ((event.target as HTMLInputElement).checked) picked.add(preset.id);
            else picked.delete(preset.id);
            set(list.map((p) => p.id).filter((id) => picked.has(id)));
          },
        }),
        h("span", null, preset.zh, h("span", { lang: "ja", class: "block text-sm text-muted" }, plain(preset.jp))),
      ),
    ),
  );
}

/**
 * An editable list: one card per item, a delete button on each, and an add
 * button below. Only add and delete redraw the list; typing never does, so
 * the caret stays where it is.
 */
function listEditor<T>(options: {
  items: T[];
  noun: string;
  make: () => T;
  row: (item: T, index: number) => HTMLElement[];
  onChange: () => void;
}): HTMLElement {
  const box = h("div", { class: "space-y-3" });
  function draw(focusLast = false): void {
    fill(
      box,
      options.items.map((item, i) =>
        h(
          "div",
          { class: CARD },
          h(
            "div",
            { class: "flex items-center justify-between" },
            h("p", { class: "text-lg font-bold text-muted" }, `${options.noun} ${i + 1}`),
            h(
              "button",
              {
                type: "button",
                class: "inline-flex min-h-12 items-center gap-1 rounded-full px-3 text-base font-bold text-shu active:bg-shu-soft",
                onclick: () => {
                  options.items.splice(i, 1);
                  options.onChange();
                  draw();
                },
              },
              icon("trash", "h-5 w-5"),
              "刪除",
            ),
          ),
          ...options.row(item, i),
        ),
      ),
      options.items.length < LIMITS.list
        ? h(
            "button",
            {
              type: "button",
              class: `${BUTTON.secondary} text-ai`,
              onclick: () => {
                options.items.push(options.make());
                options.onChange();
                draw(true);
              },
            },
            icon("plus"),
            `新增${options.noun}`,
          )
        : null,
    );
    if (focusLast) {
      const cards = box.querySelectorAll<HTMLElement>(":scope > div");
      cards[cards.length - 1]?.querySelector<HTMLInputElement>("input:not([type=radio])")?.focus();
    }
  }
  draw();
  return box;
}

function hotelRow(hotel: Hotel, save: () => void): HTMLElement[] {
  return [
    field("飯店日文名稱", hotel.name, (v) => ((hotel.name = v), save()), {
      lang: "ja",
      placeholder: "例：ホテルグレイスリー新宿",
      hint: "從訂房確認信複製貼上最準確。",
    }),
    field("讀音（可不填）", hotel.kana, (v) => ((hotel.kana = v), save()), {
      lang: "ja",
      placeholder: "例：ほてるぐれいすりーしんじゅく",
      hint: "平假名或片假名，語音才不會念錯。",
    }),
    field("日文地址", hotel.address, (v) => ((hotel.address = v), save()), {
      lang: "ja",
      max: LIMITS.long,
      placeholder: "例：東京都新宿区歌舞伎町1-19-1",
    }),
    field("飯店電話", hotel.phone, (v) => ((hotel.phone = v), save()), { type: "tel", placeholder: "例：03-1234-5678" }),
    h(
      "div",
      { class: "grid grid-cols-2 gap-3" },
      field("入住日", hotel.from, (v) => ((hotel.from = v), save()), { type: "date" }),
      field("退房日", hotel.to, (v) => ((hotel.to = v), save()), { type: "date" }),
    ),
  ];
}

function placeRow(place: Place, index: number, save: () => void): HTMLElement[] {
  const name = `place-kind-${index}`;
  const kind = (value: Place["kind"], label: string) =>
    h(
      "label",
      { class: "flex min-h-14 items-center justify-center gap-2 rounded-xl bg-card text-lg font-bold ring-2 ring-hair has-[:checked]:bg-ai-soft has-[:checked]:ring-ai" },
      h("input", {
        type: "radio",
        name,
        class: "h-5 w-5 accent-[rgb(var(--ai))]",
        checked: place.kind === value,
        onchange: () => ((place.kind = value), save()),
      }),
      label,
    );
  return [
    h("div", { class: "grid grid-cols-2 gap-3", role: "radiogroup", "aria-label": "類型" }, kind("station", "🚉 車站"), kind("place", "📍 地點")),
    field("日文名稱", place.name, (v) => ((place.name = v), save()), {
      lang: "ja",
      placeholder: "例：新宿、浅草寺",
      hint: "車站不用加「駅」，會自動加上。",
    }),
    field("讀音（可不填）", place.kana, (v) => ((place.kana = v), save()), { lang: "ja", placeholder: "例：しんじゅく" }),
    field("中文名稱", place.zh, (v) => ((place.zh = v), save()), { placeholder: "例：新宿" }),
    field("哪一天去（可不填）", place.date, (v) => ((place.date = v), save()), { type: "date", hint: "當天會排在最前面。" }),
  ];
}

function contactFields(contact: Contact, save: () => void, phoneHint: string): HTMLElement[] {
  return [
    h(
      "div",
      { class: "grid grid-cols-2 gap-3" },
      field("關係", contact.relation, (v) => ((contact.relation = v), save()), { placeholder: "例：女兒" }),
      field("姓名", contact.name, (v) => ((contact.name = v), save()), { autocomplete: "off" }),
    ),
    field("電話", contact.phone, (v) => ((contact.phone = v), save()), { type: "tel", hint: phoneHint, max: 40 }),
  ];
}

function medRow(med: Med, save: () => void): HTMLElement[] {
  return [
    field("成分名稱（英文）", med.ingredient, (v) => ((med.ingredient = v), save()), {
      placeholder: "例：Amlodipine",
      hint: "藥袋或藥盒上的英文成分名，日本醫師看得懂；不要寫商品名。",
    }),
    field("劑量與次數", med.dose, (v) => ((med.dose = v), save()), { placeholder: "例：5mg，一天一次" }),
  ];
}

export function renderSetup(root: HTMLElement): void {
  // Edited in place; every change is saved at once, so nothing is lost if the page closes.
  const profile: Profile = loadProfile();
  const save = () => saveProfile(parseProfile(profile));
  const year = profile.birthYear === null ? "" : String(profile.birthYear);

  page(root, "設定資料", [
    h(
      "p",
      { class: "mt-2 rounded-2xl bg-ai-soft p-4 text-lg leading-relaxed" },
      "出發前填好，到時候就不用打字。全部都可以不填，填越多越好用。",
      h("br"),
      "資料只存在這支手機，",
      h("b", null, "不會上傳到任何地方"),
      "。",
    ),
    section(
      "旅客",
      h(
        "div",
        { class: CARD },
        field("稱呼", profile.callName, (v) => ((profile.callName = v), save()), {
          placeholder: "例：媽媽、小美",
          hint: "首頁會用這個稱呼打招呼。",
          max: 20,
        }),
        field("護照上的英文姓名", profile.passportName, (v) => ((profile.passportName = v), save()), {
          placeholder: "例：LIN MEI-HUA",
          hint: "求救卡和醫療卡會給警察、醫院看。",
        }),
        field(
          "出生年（西元）",
          year,
          (v) => {
            const n = Number(v);
            profile.birthYear = Number.isInteger(n) && n >= 1900 && n <= 2100 ? n : null;
            save();
          },
          { inputmode: "numeric", placeholder: "例：1956", hint: "醫院一定會問年齡。", max: 4 },
        ),
      ),
    ),
    section(
      "飯店",
      listEditor({ items: profile.hotels, noun: "飯店", make: (): Hotel => ({ name: "", kana: "", address: "", phone: "", from: "", to: "" }), row: (hotel) => hotelRow(hotel, save), onChange: save }),
    ),
    section(
      "每天要去的車站或地點",
      h("p", { class: "mb-3 text-lg text-muted" }, "「我想去〇〇站」「這班車有停〇〇嗎」會直接用這些名稱，不用打字。"),
      listEditor({ items: profile.places, noun: "目的地", make: (): Place => ({ kind: "station", name: "", kana: "", zh: "", date: "" }), row: (place, i) => placeRow(place, i, save), onChange: save }),
    ),
    section(
      "緊急聯絡人",
      h("p", { class: "mb-3 text-lg text-muted" }, "通常是在台灣的家人。第一位會放在求救卡上。"),
      listEditor({
        items: profile.contacts,
        noun: "聯絡人",
        make: (): Contact => ({ relation: "", name: "", phone: "" }),
        row: (contact) => contactFields(contact, save, "台灣手機直接寫 09 開頭就好，例：0912-345-678。"),
        onChange: save,
      }),
    ),
    section(
      "日本當地聯絡人（可不填）",
      h(
        "div",
        { class: CARD },
        h("p", { class: "text-lg text-muted" }, "在日本的朋友、親戚或導遊。日本人最容易幫忙打的電話。"),
        ...contactFields(profile.localContact, save, "日本電話，例：090-1234-5678。"),
      ),
    ),
    section(
      "慢性病",
      presets(CONDITIONS, profile.health.conditions, (ids) => ((profile.health.conditions = ids), save())),
      h(
        "div",
        { class: "mt-3" },
        field("其他（請寫英文）", profile.health.conditionsOther, (v) => ((profile.health.conditionsOther = v), save()), {
          max: LIMITS.long,
          placeholder: "例：Glaucoma",
        }),
      ),
    ),
    section(
      "常吃的藥",
      listEditor({ items: profile.health.meds, noun: "藥", make: (): Med => ({ ingredient: "", dose: "" }), row: (med) => medRow(med, save), onChange: save }),
    ),
    section(
      "血型",
      h(
        "select",
        {
          class: INPUT,
          "aria-label": "血型",
          onchange: (event: Event) => {
            profile.health.bloodType = (event.target as HTMLSelectElement).value as Profile["health"]["bloodType"];
            save();
          },
        },
        (["", "A", "B", "O", "AB"] as const).map((type) =>
          h("option", { value: type, selected: profile.health.bloodType === type }, type ? `${type} 型` : "不知道／不填"),
        ),
      ),
    ),
    section("藥物過敏", presets(DRUG_ALLERGIES, profile.health.drugAllergies, (ids) => ((profile.health.drugAllergies = ids), save()))),
    section(
      "食物過敏",
      presets(FOOD_ALLERGIES, profile.health.foodAllergies, (ids) => ((profile.health.foodAllergies = ids), save())),
    ),
    section("飲食習慣", presets(DIETS, profile.health.diets, (ids) => ((profile.health.diets = ids), save()))),
    h(
      "div",
      { class: "mt-3" },
      field("其他過敏（請寫英文）", profile.health.allergyOther, (v) => ((profile.health.allergyOther = v), save()), {
        max: LIMITS.long,
        placeholder: "例：Latex",
      }),
    ),
    section(
      "旅遊保險（可不填）",
      h(
        "div",
        { class: CARD },
        field("保險公司", profile.insurance.company, (v) => ((profile.insurance.company = v), save())),
        field("保單號碼", profile.insurance.policy, (v) => ((profile.insurance.policy = v), save())),
        field("24 小時救援電話", profile.insurance.phone, (v) => ((profile.insurance.phone = v), save()), {
          type: "tel",
          max: 40,
          hint: "保單上的海外急難救助電話，請包含國碼，例：+886-2-1234-5678。",
        }),
      ),
    ),
    h(
      "div",
      { class: "mt-8 space-y-3" },
      h("a", { href: "#/share", class: BUTTON.primary }, icon("share"), "填好了，分享給旅客"),
      h("a", { href: "#/", class: BUTTON.secondary }, icon("check"), "填好了，我自己要用"),
      h("a", { href: "#/print", class: BUTTON.secondary }, icon("print"), "列印護貝小卡"),
      h(
        "button",
        {
          type: "button",
          class: "mt-6 w-full min-h-14 rounded-2xl text-lg font-bold text-shu active:bg-shu-soft",
          onclick: () => {
            if (!confirm("確定要清除這支手機上的所有資料嗎？")) return;
            clearProfile();
            Object.assign(profile, emptyProfile());
            renderSetup(root);
          },
        },
        "清除所有資料",
      ),
    ),
  ]);
}
