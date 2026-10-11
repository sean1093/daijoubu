import type { Scene, SceneId } from "../types";
import drugstore from "./drugstore";
import emergency from "./emergency";
import family from "./family";
import hotel from "./hotel";
import konbini from "./konbini";
import restaurant from "./restaurant";
import shopping from "./shopping";
import toilet from "./toilet";
import transport from "./transport";

/** Home screen order: most important first. */
export const SCENES: Scene[] = [transport, hotel, restaurant, konbini, shopping, drugstore, toilet, family, emergency];

export function sceneById(id: string | undefined): Scene | undefined {
  return SCENES.find((scene) => scene.id === (id as SceneId));
}
