import React from "react";
import { Question } from "../../../../models/question.js";
import TriviaQuestions from "../../../../components/games/trivia/triviaQuestions";

const questions: Question[] = [
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
