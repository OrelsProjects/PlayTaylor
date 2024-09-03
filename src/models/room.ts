import { QuestionResponse, Difficulty, Question } from "./question";
import { GameStage } from "./gameStage";

export const QUESTION_TIME = 20; // 20 seconds
export const QUESTION_ENDED_TIME = 3; // 3 seconds
export const SHOW_LEADERBOARD_TIME = 7; // 7 seconds

export interface Participant {
  questionResponses?: QuestionResponse[];
  joinedAt: number;
  name: string;
  userId?: string | null;
  leftAt?: number | null;
}

export type QuestionWithTimer = Question & { timer: number };

export default interface Room {
  code: string;
  currentQuestion: QuestionWithTimer;
  name: string;
  createdBy: string;
  countdownStartedAt?: number | null;
  countdownCurrentTime?: number | null;
  countdownQuestionEnded?: number | null;
  countdownShowLeaderboard?: number | null;
  stage: GameStage;
  participants: Participant[];
  questions: Question[];
  gameStartedAt?: number | null;
}

export type CreateRoom = Pick<Room, "name"> & {
  questionsCount: number;
  participantsCount: number;
  difficulty: Difficulty;
};
