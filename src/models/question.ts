export type QuestionType = "trivia" | "swipe" | "sing-the-lyrics";

export type QuestionId = string;

export type Difficulty = "debut" | "1989" | "folklore";
export type QuestionsStatus = "idle" | "loading" | "succeeded" | "failed";

export const allDifficulties: Difficulty[] = ["debut", "1989", "folklore"];

export interface Question {
  id: QuestionId;
  title: string;
  content: string;
  image: string;
  answer: string;
  type: QuestionType;
  difficulty: Difficulty;
}

export interface QuestionResponse {
  id: string;
  questionId: string;
  userId: string;
  response: string;
  isCorrect: boolean;
  answeredAt: Date;
}
