import React, { useState } from "react";
import OptimizedImage from "../../ui/OptimizedImage";
import { TriviaQuestion } from "../model";
import { Button } from "../../ui/button";
import { motion } from "framer-motion";

interface TriviaContentProps {
  question: TriviaQuestion;
  onNext: () => void;
}

const TriviaContent: React.FC<TriviaContentProps> = ({ question, onNext }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="h-full w-full flex flex-col items-start justify-start p-4 gap-24">
      <div className="w-full flex flex-row gap-2 items-center">
        <OptimizedImage
          src={question.image}
          alt={"Question image"}
          width={40}
          height={40}
          className="rounded-full"
        />
        <span className="font-medium">{question.title}</span>
      </div>
      <div className="w-full h-full flex flex-col justify-between">
        <motion.span
          initial={{ opacity: 1 }}
          animate={{
            opacity: showAnswer ? 0 : 1,
            height: showAnswer ? 0 : "",
          }}
          transition={{ duration: 0.5 }}
          className="w-full text-[32px] tracking-[0.5px] font-bold text-center"
        >
          {question.content}
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: showAnswer ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="w-full text-[32px] tracking-[0.5px] font-bold text-center"
        >
          {question.answer}
        </motion.span>
        <div className="flex flex-row gap-2 self-end mt-auto">
          <Button
            variant="outline"
            className="w-fit bg-card border-foreground"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            Show
          </Button>
          <Button className="w-fit" onClick={onNext}>
            Got it, next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TriviaContent;
