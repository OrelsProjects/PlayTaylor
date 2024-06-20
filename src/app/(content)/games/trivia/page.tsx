import React from "react";
import { TriviaQuestion } from "../../../../components/games/model";
import TriviaQuestions from "../../../../components/games/trivia/triviaQuestions";

const questions: TriviaQuestion[] = [
  {
    title: "What's the meaning of",
    content: "Condescending",
    answer: "Patronizing, showing superiority",
    image: "/album-taylor-swift.png",
  },
  {
    title: "What's the meaning of",
    content: "Condescending1",
    answer: "Patronizing, showing superiority",
    image: "/album-taylor-swift.png",
  },
  {
    title: "What's the meaning of",
    content: "Condescending",
    answer: "Patronizing, showing superiority",
    image: "/album-taylor-swift.png",
  },
  {
    title: "What's the meaning of",
    content: "Condescending1",
    answer: "Patronizing, showing superiority",
    image: "/album-taylor-swift.png",
  },
  {
    title: "What's the meaning of",
    content: "Condescending",
    answer: "Patronizing, showing superiority",
    image: "/album-taylor-swift.png",
  },
  {
    title: "What's the meaning of",
    content: "Condescending1",
    answer: "Patronizing, showing superiority",
    image: "/album-taylor-swift.png",
  },
  {
    title: "What's the meaning of",
    content: "Condescending",
    answer: "Patronizing, showing superiority",
    image: "/album-taylor-swift.png",
  },
  {
    title: "What's the meaning of",
    content: "Condescending",
    answer: "Patronizing, showing superiority",
    image: "/album-taylor-swift.png",
  },
  {
    title: "What's the meaning of",
    content: "Condescending",
    answer: "Patronizing, showing superiority",
    image: "/album-taylor-swift.png",
  },
  {
    title: "What's the meaning of",
    content: "Condescending",
    answer: "Patronizing, showing superiority",
    image: "/album-taylor-swift.png",
  },
  {
    title: "What's the meaning of",
    content: "Condescending",
    answer: "Patronizing, showing superiority",
    image: "/album-taylor-swift.png",
  },
  {
    title: "What's the meaning of",
    content: "Condescending",
    answer: "Patronizing, showing superiority",
    image: "/album-taylor-swift.png",
  },
  {
    title: "What's the meaning of",
    content: "Condescending",
    answer: "Patronizing, showing superiority",
    image: "/album-taylor-swift.png",
  },
];
const SwipeGamePage: React.FC = () => {
  return <TriviaQuestions questions={questions} />;
};

export default SwipeGamePage;
