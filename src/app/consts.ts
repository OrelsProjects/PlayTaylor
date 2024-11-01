export const slideAnimationProps = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0, transition: { duration: 0.5 } },
  transition: { duration: 0.5, ease: "easeInOut" },
};

export const slideFromTopAnimationProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.5 } },
  transition: { duration: 0.9, ease: "easeInOut", delay: 0.5 },
};

export const question =
  "In which city did Taylor Swift\ncall Sabrina Carpenter on the\n phone on stage?";
export const answers: { answer: string; isCorrect: boolean }[] = [
  { answer: "New Orleans", isCorrect: true },
  { answer: "London", isCorrect: false },
  { answer: "Indianapolis", isCorrect: false },
  { answer: "Miami", isCorrect: false },
];

interface CardText {
  text: string;
  duration: number;
}

export const selectedTextCorrect = "That's correct!";
export const selectedTextIncorrect = "That's incorrect!";

export const triesLeftTextFlow: CardText[] = [
  {
    text: "The past is the past\nhere's one more chance",
    duration: 3000,
  },
];

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

export const sectionText = [
  {
    title: "All you have to do is play!",
    body: "A new Trivia game that is all about our favourite artist! Gather your friends for an unforgettable night, and find out who knows best about our beloved blondie, and her music!!",
    src: "/taylor-sabrina.png",
    alt: "taylor and sabrina carpenter",
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
