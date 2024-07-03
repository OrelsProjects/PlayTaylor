import { QuestionType } from "../../../models/question";

export interface InstructionItem {
  title: string;
  description: string;
  index: number;
}

export const instructionItems: Record<QuestionType, InstructionItem[]> = {
  swipe: [
    {
      index: 1,
      title: "Dear Reader",
      description: "Read the statement",
    },
    {
      index: 2,
      title: "Swipe Right",
      description: "If you think the statement is right and real",
    },
    {
      index: 3,
      title: "Swipe Left",
      description: "If you think the statement is fake, fake, fake",
    },
  ],
  "sing-the-lyrics": [
    {
      index: 1,
      title: "Dear Reader",
      description: "Read the lyrics",
    },
    {
      index: 2,
      title: "Sing the lyrics",
      description:
        "Sing it out loud fearlessly. Ask other Swifties to join and make the whole place shimmer.",
    },
    {
      index: 3,
      title: "Reveal it",
      description: "If your brain has a glitch, press “Song Name”",
    },
  ],
  trivia: [
    {
      index: 1,
      title: "See the word",
      description: "Speak now if you know the meaning.",
    },
    {
      index: 2,
      title: "Reveal it",
      description:
        'If it\'s a blank space in your mind, press "Show Meaning" and shake it off.',
    },
    {
      index: 3,
      title: "Sing Along",
      description:
        "Optional—belt out the lyric, guided by the album cover as your easter egg.",
    },
  ],
};
