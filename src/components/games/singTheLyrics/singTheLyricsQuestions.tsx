"use client";

import React, { useState } from "react";
import Card from "../card";
import SignTheLyricsContent from "./singTheLyricsContent";
import useGame from "../../../lib/hooks/useGame";
import GameFinishedComponent from "../../ui/gameFinished";
import { EventTracker } from "../../../eventTracker";

const SingTheLyricsQuestions: React.FC = () => {
  const { singTheLyricsQuestions: questions } = useGame();

  const [index, setIndex] = useState(0);
  const question = questions[index];

  const handleNext = () => {
    EventTracker.track("Sing The Lyrics Question Answered", {
      question: question.content,
      answer: question.answer,
    });
    setIndex(index + 1);
  };

  return (
    <div className="flex flex-col h-full justify-evenly">
      {question ? (
        <div className="flex items-center justify-center relative">
          <Card className="z-50">
            <SignTheLyricsContent question={question} onNext={handleNext} />
          </Card>
        </div>
      ) : (
        <GameFinishedComponent />
      )}
    </div>
  );
};

export default SingTheLyricsQuestions;
