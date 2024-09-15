export const slideAnimationProps = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0, transition: { duration: 0.5 } },
  transition: { duration: 0.5, ease: "easeInOut" },
};

export const question =
  "Who has Taylor Swift endorsed\n for the upcoming election?";
export const answers: { answer: string; isCorrect: boolean }[] = [
  { answer: "Jill Stein", isCorrect: false },
  { answer: "Cornel West", isCorrect: false },
  { answer: "Donald Trump", isCorrect: false },
  { answer: "Kamala Harris", isCorrect: true },
];

interface CardText {
  text: string;
  duration: number;
}

export const selectedTextCorrect: CardText = {
  text: "That's correct!",
  duration: 1500,
};
export const selectedTextIncorrect = {
  text: "That's incorrect!",
  duration: 1500,
};

export const selectedTextFlow: CardText[] = [
  {
    text: "Think you are a\n Taylor Swift\n Mastermind?",
    duration: 2000,
  },
  {
    text: "Prove it!",
    duration: 1500,
  },
];
