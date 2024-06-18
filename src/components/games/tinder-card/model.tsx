export type SwipeDirection = "left" | "right";

export interface Question {
  text: string;
  image: string;
  swipeLeftAnswer: string;
  swipeRightAnswer: string;
  correctAnswerText: string;
  correctAnswer: SwipeDirection;
}
