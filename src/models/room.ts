import { Question } from "@prisma/client";

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
  participants: Participant[];
  questions: Question[];
  gameStartedAt?: number | null;
}
