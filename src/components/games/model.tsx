export type SwipeDirection = "left" | "right";

export interface TrueFalseQuestion {
  text: string;
  image: string;
  swipeLeftAnswer: string;
  swipeRightAnswer: string;
  correctAnswerText: string;
  correctAnswer: SwipeDirection;
}

export interface TriviaQuestion {
  title: string;
  content: string;
  image: string;
  answer: string;
}