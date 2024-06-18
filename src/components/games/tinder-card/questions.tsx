"use client";

import React, { useState } from "react";
import Card from "../card";
import Interactable from "./interactable";
import { Question, SwipeDirection } from "./model";
import TinderCardContent from "./tinderCardContent";
import { cn } from "../../../lib/utils";

interface QuestionsProps {
  questions: Question[];
}

type AnswerResponse = "correct" | "incorrect" | "none";

const Questions: React.FC<QuestionsProps> = ({ questions }) => {
  const [index, setIndex] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] =
    useState<AnswerResponse>("none");

  const handleSwipe = (direction: SwipeDirection) => {
    if (questions[index].correctAnswer === direction) {
      setAnsweredCorrectly("correct");
    } else {
      setAnsweredCorrectly("incorrect");
    }
  };

  const handleSnap = (x: number) => {
    if (x !== 0) {
      setIndex(index + 1);
      setAnsweredCorrectly("none");
    }
  };

  const question = questions[index];

  return (
    <div className="flex flex-col h-full justify-evenly">
      <div className="flex items-center justify-center m-4">
        <Interactable
          snapPoints={[{ x: -300 }, { x: 0 }, { x: 300 }]}
          onSnap={handleSnap}
          onSwipe={handleSwipe}
        >
          <Card
            className={cn("transition-colors duration-300", {
              "bg-green-200": answeredCorrectly === "correct",
              "bg-red-200": answeredCorrectly === "incorrect",
            })}
          >
            <TinderCardContent question={question} />
          </Card>
        </Interactable>
      </div>
    </div>
  );
};

export default Questions;
