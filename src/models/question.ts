export type Difficulty = "debut" | "midnights" | "folklore";
export type QuestionType = "trivia" | "swipe" | "sing-the-lyrics";

export type QuestionId = string;

export const allDifficulties: Difficulty[] = ["debut", "midnights", "folklore"];

export interface Question {
  id: QuestionId;
  title: string;
  content: string;
  image: string;
  answer: string;
  type: QuestionType;
  difficulty: Difficulty;
}
