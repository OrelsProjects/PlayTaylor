export type GameStage =
  | "lobby"
  | "countdown"
  | "playing"
  | "paused"
  | "question-ended"
  | "show-leaderboard"
  | "game-ended";

export const isGameStarted = (stage: GameStage) =>
  stage === "playing" ||
  stage === "question-ended" ||
  stage === "paused" ||
  stage === "game-ended" ||
  stage === "show-leaderboard" ||
  stage === "countdown";

export const isGameEnded = (stage: GameStage) => stage === "game-ended";
