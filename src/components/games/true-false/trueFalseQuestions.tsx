"use client";

import React, { useMemo, useState } from "react";
import Card from "../card";
import Interactable from "./interactable";
import TrueFalseContent from "./trueFalseContent";
import { cn } from "../../../lib/utils";
import useGame from "../../../lib/hooks/useGame";
import GameFinishedComponent from "../../ui/gameFinished";

type AnswerResponse = "correct" | "incorrect" | "none";

const TrueFalseQuestions: React.FC = () => {
  const {
    swipeQuestions: questions,
    swipeCorrectAnswers: correctAnswers,
    handleQuestionAnswered,
  } = useGame();

  const [index, setIndex] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] =
    useState<AnswerResponse>("none");

  const shuffledQuestions = useMemo(() => {
    return questions.sort(() => Math.random() - 0.5);
  }, [questions]);

  const handleSwipe = (response: boolean) => {
    const answer = questions[index].answer === "true";

    handleQuestionAnswered(questions[index], response.toString());
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

  const question = useMemo(() => {
    return shuffledQuestions[index];
  }, [index, shuffledQuestions]);

  return (
    <div className="flex flex-col h-full justify-evenly">
      {question ? (
        <div className="flex items-center justify-center m-4">
          <Interactable
            snapPoints={[{ x: -150 }, { x: 0 }, { x: 150 }]}
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
      ) : (
        <GameFinishedComponent
          questionsCount={questions.length}
          correctAnswers={correctAnswers.length}
        />
      )}
    </div>
  );
};

export default TrueFalseQuestions;
