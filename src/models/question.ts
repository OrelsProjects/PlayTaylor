export type QuestionType = "trivia" | "swipe" | "sing-the-lyrics";

export type QuestionId = string;

export type Difficulty = "debut" | "1989" | "folklore";
export type QuestionsStatus = "idle" | "loading" | "succeeded" | "failed";

export const allDifficulties: Difficulty[] = ["debut", "1989", "folklore"];

export const numberToDifficulty = {
  1: "debut",
  2: "1989",
  3: "folklore",
};

export type QuestionWithTimer = Question & { timer: number };

export interface QuestionOption {
  questionId: QuestionId;
  option: string;
  correct: boolean;
  position: number;
}

export interface Question {
  id: QuestionId;
  question: string;
  options: QuestionOption[];
  difficulty: Difficulty;
}

export interface QuestionResponse {
  userId?: string;
  questionId: string;
  answeredAt: Date;
  response: QuestionOption;
}
