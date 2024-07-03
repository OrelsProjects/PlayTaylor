"use client";

import React, { useMemo, useState } from "react";
import Card from "../card";
import TriviaContent from "./triviaContent";
import useGame from "../../../lib/hooks/useGame";
import GameFinishedComponent from "../../ui/gameFinished";
import { EventTracker } from "../../../eventTracker";

const TriviaQuestions: React.FC = () => {
  const { triviaQuestions: questions } = useGame();

  const [index, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [showAd, setShowAd] = useState(false);

  const shuffledQuestions = useMemo(() => {
    return questions.sort(() => Math.random() - 0.5);
  }, [questions]);

  const question = useMemo(() => {
    return shuffledQuestions[index];
  }, [index, shuffledQuestions]);

  const handleNext = () => {
    setIndex(index + 1);
    if (index > 0 && index % 4 === 0) {
      setShowAd(true);
    } else {
      setShowAd(false);
    }
    EventTracker.track("Trivia Question Answered", {
      question: question.content,
      answer: question.answer,
    });
    setNextIndex(nextIndex + 1);
  };

  const isMoreThanFourQuestions = useMemo(
    () => questions.length - index > 4,
    [questions],
  );

  return (
    <div className="flex flex-col h-full justify-evenly">
      {question ? (
        <div className="flex items-center justify-center relative">
          <Card className="w-full z-50">
            <TriviaContent
              question={question}
              onNext={handleNext}
              showAd={showAd}
            />
          </Card>
          {isMoreThanFourQuestions && (
            <div className="card w-full absolute z-40 overflow-visible px-2">
              <div className="card ml-8 z-40 rotate-[3.9deg] absolute" />
              <div className="card z-40 ml-8 -rotate-[3deg] absolute" />
              <div className="card z-40 -rotate-[5deg] absolute" />
            </div>
          )}
        </div>
      ) : (
        <GameFinishedComponent />
      )}
    </div>
  );
};

export default TriviaQuestions;
