"use client";

import React, { useMemo, useState } from "react";
import Card from "../card";
import TriviaContent from "./triviaContent";
import useGame from "../../../lib/hooks/useGame";

const TriviaQuestions: React.FC = () => {
  const { triviaQuestions: questions } = useGame();

  const [index, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [showAd, setShowAd] = useState(false);

  const question = questions[index];

  const handleNext = () => {
    setIndex(index + 1);
    if (index > 0 && index % 4 === 0) {
      setShowAd(true);
    } else {
      setShowAd(false);
    }

    setNextIndex(nextIndex + 1);
  };

  const isMoreThanFourQuestions = useMemo(
    () => questions.length - index > 4,
    [questions],
  );

  return (
    <div className="flex flex-col h-full justify-evenly">
      {question && (
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
      )}
    </div>
  );
};

export default TriviaQuestions;
