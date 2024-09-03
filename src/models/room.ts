/**
 * Room contains all the static data for the room.
 * The data here is static and does not change based on the game state.
 */

import { Difficulty, Question } from "./question";
export type QuestionWithTimer = Question & { timer: number };

export default interface Room {
  code: string;
  name: string;
  createdBy: string;
  questions: Question[];
}

export type CreateRoom = {
  name: string;
  questionsCount: number;
  participantsCount: number;
  difficulty: Difficulty;
};
