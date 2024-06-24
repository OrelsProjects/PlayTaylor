export type QuestionType = "trivia" | "swipe" | "sing-the-lyrics";

export type QuestionId = string;

export interface Question {
  id: QuestionId;
  title: string;
  content: string;
  image: string;
  answer: string;
  type: QuestionType;
}
