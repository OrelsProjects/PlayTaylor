export interface TrueFalseQuestion {
  text: string;
  image: string;
  correctAnswerText: string;
  correctAnswer: boolean;
}

export interface TriviaQuestion {
  title: string;
  content: string;
  image: string;
  answer: string;
}