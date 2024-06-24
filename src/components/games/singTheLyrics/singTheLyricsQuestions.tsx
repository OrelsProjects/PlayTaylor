"use client";

import React, { useState } from "react";
import Card from "../card";
import { Question } from "../../../models/question";
import SignTheLyricsContent from "./singTheLyricsContent";

interface SingTheLyricsQuestionsProps {
  questions: Question[];
}

const SingTheLyricsQuestions: React.FC<SingTheLyricsQuestionsProps> = ({
  questions,
}) => {
  const [index, setIndex] = useState(0);
  const question = questions[index];

  const handleNext = () => {
    setIndex(index + 1);
  };

  return (
    <div className="flex flex-col h-full justify-evenly">
      <div className="flex items-center justify-center relative">
        <Card className="z-50">
          <SignTheLyricsContent question={question} onNext={handleNext} />
        </Card>
      </div>
    </div>
  );
};

export default SingTheLyricsQuestions;
