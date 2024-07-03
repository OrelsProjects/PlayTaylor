import React, { useState } from "react";
import OptimizedImage from "../../ui/optimizedImage";
import { Question } from "../../../models/question";
import { Button } from "../../ui/button";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import AdTrivia from "../../ads/adTrivia";

interface TriviaContentProps {
  question: Question;
  className?: string;
  onNext: () => void;
  showAd?: boolean;
}

const TriviaContent: React.FC<TriviaContentProps> = ({
  question,
  className,
  onNext,
  showAd,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [forceHideAnswer, setForceHideAnswer] = useState(false);

  return (
    <div
      className={cn(
        "h-full w-full flex flex-col items-start justify-start p-4 gap-24 relative",
        className,
      )}
    >
      <div
        className={cn(
          "h-full w-full flex flex-col items-start justify-start p-4 gap-24 relative",
          className,
        )}
      >
        <div className="w-full flex flex-row gap-2 items-center">
          <OptimizedImage
            src={question.image}
            alt={"Question image"}
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-medium text-primary">{question.title}</span>
        </div>
        <div className="w-full h-full flex flex-col justify-between">
          <motion.span
            initial={{ opacity: 1 }}
            animate={{
              opacity: showAnswer ? 0 : 1,
              height: showAnswer ? 0 : "",
            }}
            transition={{ duration: 0.5 }}
            className="w-full text-[32px] tracking-[0.5px] font-bold text-center text-primary "
          >
            {question.content}
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: showAnswer ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="w-full text-[32px] tracking-[0.5px] font-bold text-center h-8 text-primary"
          >
            {forceHideAnswer ? "" : question.answer}
          </motion.span>
          <div className="flex flex-row gap-2 self-end mt-auto">
            <Button
              variant="outline"
              className="w-fit bg-card text-primary border-primary"
              onClick={() => {
                setShowAnswer(!showAnswer);
                setForceHideAnswer(false);
              }}
            >
              Show
            </Button>
            <Button
              className="w-fit"
              onClick={() => {
                setForceHideAnswer(true);
                setShowAnswer(false);
                onNext();
              }}
            >
              Got it, next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriviaContent;
