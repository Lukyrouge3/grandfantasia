import { writable, type Writable } from "svelte/store";

export const lang: Writable<"fr" | "en" | "es" | "pt"> = writable("fr");