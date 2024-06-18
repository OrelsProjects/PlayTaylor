"use client";

import React, { useMemo, useState } from "react";
import Card from "../card";
import { TriviaQuestion } from "../model";
import TriviaContent from "./triviaContent";

interface TriviaQuestionsProps {
  questions: TriviaQuestion[];
}

const TriviaQuestions: React.FC<TriviaQuestionsProps> = ({ questions }) => {
  const [index, setIndex] = useState(0);
  const question = questions[index];

  const handleNext = () => {
    setIndex(index + 1);
  };

  const isMoreThanFourQuestions = useMemo(
    () => questions.length - index > 4,
    [questions],
  );

  return (
    <div className="flex flex-col h-full justify-evenly">
      <div className="flex items-center justify-center relative">
        <Card className="w-full z-50">
          <TriviaContent question={question} onNext={handleNext} />
        </Card>
        <div className="card w-full absolute z-40 bg-red-500 overflow-visible px-2">
          <div className="card ml-8 z-40 rotate-[3.9deg] absolute" />
          <div className="card z-40 ml-8 -rotate-[3deg] absolute" />
          <div className="card z-40 -rotate-[5deg] absolute" />
        </div>
      </div>
    </div>
  );
};

export default TriviaQuestions;
