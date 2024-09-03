/**
 * Game contains all the logic for the game.
 * The data here is dynamic and changes based on the game state and the actions of the participants.
 */

import { QuestionResponse, QuestionWithTimer } from "./question";

export const QUESTION_TIME = 20; // 20 seconds
export const QUESTION_ENDED_TIME = 3; // 3 seconds
export const SHOW_LEADERBOARD_TIME = 7; // 7 seconds

// Game

export interface Game {
    stage: GameStage;
    participants: Participant[];
    currentQuestion: QuestionWithTimer;
    
    gameStartedAt?: number | null;
    countdownStartedAt?: number | null;
    countdownCurrentTime?: number | null;
    countdownQuestionEnded?: number | null;
    countdownShowLeaderboard?: number | null;
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

export const isGameStarted = (stage: GameStage) =>
  stage === "playing" ||
  stage === "question-ended" ||
  stage === "paused" ||
  stage === "game-ended" ||
  stage === "show-leaderboard" ||
  stage === "countdown";

export const isGameEnded = (stage: GameStage) => stage === "game-ended";

// Participant

export interface Participant {
    questionResponses?: QuestionResponse[];
    joinedAt: number;
    name: string;
    userId?: string | null;
    leftAt?: number | null;
  }
  