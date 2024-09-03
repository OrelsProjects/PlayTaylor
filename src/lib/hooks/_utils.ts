export type Stage = "name" | "participants" | "difficulty" | "question";

const LOCAL_STORAGE_PREFIX = "create_game_play_tayor";

export const buildLocalSotrageKey = (key: string) =>
  `${LOCAL_STORAGE_PREFIX}_${key}`;
