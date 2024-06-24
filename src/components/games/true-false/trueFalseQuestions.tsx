"use client";

import React, { useState } from "react";
import Card from "../card";
import Interactable from "./interactable";
import TrueFalseContent from "./trueFalseContent";
import { cn } from "../../../lib/utils";
import useGame from "../../../lib/hooks/useGame";

type AnswerResponse = "correct" | "incorrect" | "none";

const TrueFalseQuestions: React.FC = () => {
  const { swipeQuestions: questions } = useGame();

  const [index, setIndex] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] =
    useState<AnswerResponse>("none");

  const handleSwipe = (response: boolean) => {
    const answer = questions[index].answer === "true";
    if (answer === response) {
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
      {question && (
        <div className="flex items-center justify-center m-4">
          <Interactable
            snapPoints={[{ x: -300 }, { x: 0 }, { x: 300 }]}
            onSnap={handleSnap}
            onSwipe={handleSwipe}
          >
            <Card
              className={cn("transition-colors duration-300", {
                "bg-green-400/60": answeredCorrectly === "correct",
                "bg-red-400/40": answeredCorrectly === "incorrect",
              })}
            >
              <TrueFalseContent question={question} />
            </Card>
          </Interactable>
        </div>
      )}
    </div>
  );
};

export default TrueFalseQuestions;
