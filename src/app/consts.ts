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
  duration: 132500,
};
export const selectedTextIncorrect = {
  text: "That's incorrect!",
  duration: 15300,
};

export const selectedTextFlow: CardText[] = [
  {
    text: "Think you are a\n Taylor Swift\n Mastermind?",
    duration: 2000,
  },
  {
    text: "Prove it!",
    duration: 153300,
  },
];

export const sectionText = [
  {
    title: "All you have to do is play!",
    body: "A new Trivia game that is all about our favourite artist! Gather your friends for an unforgettable night, and find out who knows best about our beloved blondie, and her music!!",
    src: "/taylor-muscle.png",
    alt: "taylor-muscle",
  },
  {
    title: "Are you going to the Eras Tour ? We've got you covered!",
    body: "Whether you're in the VIP line early in the morning or waiting inside the stadium for the show to start, just pull out your phone and play Taylor!",
    src: "/taylor-cat.png",
    alt: "taylor-cat",
  },
  {
    title: "Having a Tay Tay themed night?",
    body: "Add some fun competition to see who’s the top Swiftie and knows it all.  Just play Taylor!",
  },
];
