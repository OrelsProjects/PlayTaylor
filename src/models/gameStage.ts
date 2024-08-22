export type GameStage =
  | "lobby"
  | "countdown"
  | "playing"
  | "paused"
  | "question-ended"
  | "game-ended";

export const isGameStarted = (stage: GameStage) =>
  stage === "playing" ||
  stage === "question-ended" ||
  stage === "paused" ||
  stage === "game-ended" ||
  stage === "countdown";

export const isGameEnded = (stage: GameStage) => stage === "game-ended";
