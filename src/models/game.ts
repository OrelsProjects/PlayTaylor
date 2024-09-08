/**
 * Game contains all the logic for the game.
 * The data here is dynamic and changes based on the game state and the actions of the participants.
 */

import { Question, QuestionOption } from "./question";
import Room from "./room";

export const START_GAME_COUNTDOWN = 5; // 5 seconds
export const CURRENT_QUESTION_TIME = 20; // 20 seconds
export const QUESTION_ENDED_TIME = 3; // 3 seconds
export const SHOW_LEADERBOARD_TIME = 7; // 7 seconds

// Game

export interface Game {
  stage: GameStage;
  previousStage?: GameStage;
  currentQuestion?: Question;
  countdownStartedAt?: number | null;
  gameStartedAt?: number | null;
}

export interface Counters {
  currentQuestion?: number;
  startGame?: number;
  questionEnded?: number;
  showLeaderboard?: number;
}

// Game Stage

export type GameStage =
  | "lobby"
  | "countdown"
  | "playing"
  | "paused"
  | "question-ended"
  | "show-leaderboard"
  | "game-ended";

export const isPaused = (stage?: GameStage) => stage === "paused";

export const canShowPauseButton = (stage?: GameStage) =>
  stage === "playing" || stage === "paused" || stage === "question-ended";

export const isCountdown = (stage?: GameStage) => stage === "countdown";

export const isGameRunning = (stage?: GameStage) =>
  stage === "playing" ||
  stage === "question-ended" ||
  stage === "paused" ||
  stage === "game-ended" ||
  stage === "show-leaderboard" ||
  stage === "countdown";

export const isGameEnded = (stage?: GameStage) => stage === "game-ended";

// Participant

export interface Participant {
  name: string;
  joinedAt: number;
  userId: string;
  leftAt?: number | null;
  questionResponses?: QuestionOption[];
}

// Game Session

export type UserIdOrName = string;

/**
 * The reason for the separation of Room and Game is to have a clear distinction between static data and dynamic data.
 * Plus, when a user responds to a question, we don't want to update the whole game session data, only the participant data.
 * This way, we can avoid race conditions and unnecessary updates.
 */
export type GameSession = {
  room: Room; // Static data
  game: Game; // Dynamic data
  participants?: Participant[]; // Dynamic data
  counters: Counters; // Dynamic data
};
