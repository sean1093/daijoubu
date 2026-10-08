import type { Scene } from "../types";

/** Home screen order: most important first. */
export const SCENES: Scene[] = [
  { id: "transport", title: "交通", icon: "🚃", phrases: [], heard: [] },
  { id: "hotel", title: "飯店", icon: "🏨", phrases: [], heard: [] },
  { id: "restaurant", title: "餐廳", icon: "🍜", phrases: [], heard: [] },
  { id: "konbini", title: "便利商店", icon: "🏪", phrases: [], heard: [] },
  { id: "shopping", title: "購物", icon: "🛍️", phrases: [], heard: [] },
  { id: "drugstore", title: "藥妝店", icon: "💊", phrases: [], heard: [] },
  { id: "toilet", title: "廁所・問路", icon: "🚻", phrases: [], heard: [] },
  { id: "emergency", title: "緊急・醫療", icon: "🚑", phrases: [], heard: [] },
];
