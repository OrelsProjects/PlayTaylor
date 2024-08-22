import { Question } from "@prisma/client";
import { Difficulty } from "./question";
import { GameStage } from "./gameStage";

export interface Participant {
  correctAnswers: number;
  joinedAt: number;
  name: string;
  userId?: string | null;
  leftAt?: number | null;
}

export default interface Room {
  code: string;
  currentQuestion: number;
  name: string;
  createdBy: string;
  countdownStartedAt?: number | null;
  countdownCurrentTime?: number | null;
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
