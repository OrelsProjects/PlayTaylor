import React, { useState } from "react";
import OptimizedImage from "../../ui/optimizedImage";
import { Question } from "../../../models/question";
import { Button } from "../../ui/button";
import { motion } from "framer-motion";

interface SingTheLyricsContentProps {
  question: Question;
  onNext: () => void;
}

const ContentText = ({ content }: { content: string }) => {
  const lines = content.split("\n");
  return (
    <>
      “
      {lines.map((line, index) => (
        <span key={line}>
          {line}
          {index !== lines.length - 1 && <br />}
        </span>
      ))}
      “
    </>
  );
};

const SingTheLyricsContent: React.FC<SingTheLyricsContentProps> = ({
  question,
  onNext,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [forceHideAnswer, setForceHideAnswer] = useState(false);

  return (
    <div className="h-full w-full flex flex-col items-start justify-start p-4 gap-20">
      <div className="w-full flex flex-row gap-2 items-center p-4">
        <OptimizedImage
          src={question.image}
          alt={"Question image"}
          width={40}
          height={40}
          className="rounded-full"
        />
        <span className="font-medium text-primary">{question.title}</span>
      </div>
      <div className="w-full h-full flex flex-col gap-20">
        <div className="w-full h-full flex flex-col gap-10">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: showAnswer ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="w-full text-lg tracking-[0.5px] font-bold text-center h-8 text-primary"
          >
            {forceHideAnswer ? "" : question.answer}
          </motion.span>

          <motion.span
            initial={{ opacity: 1 }}
            className="w-full text-base font-normal italic text-center text-primary"
          >
            <ContentText content={question.content} />
          </motion.span>
        </div>
        <div className="flex flex-row gap-2 self-end mt-auto">
          <Button
            variant="outline"
            className="w-fit bg-card border-primary text-primary"
            disabled={showAnswer}
            onClick={() => {
              setShowAnswer(!showAnswer);
              setForceHideAnswer(false);
            }}
          >
            Song name
          </Button>
          <Button
            className="w-fit"
            onClick={() => {
              setForceHideAnswer(true);
              setShowAnswer(false);
              onNext();
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SingTheLyricsContent;
