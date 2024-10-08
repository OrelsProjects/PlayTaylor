export type Stage =
  | "name"
  | "participants"
  | "difficulty"
  | "question"
  | "confirm";

export const LOCAL_STORAGE_PREFIX = "play_tayor";

export const buildLocalSotrageKey = (key: string) =>
  `${LOCAL_STORAGE_PREFIX}_${key}`;
