import React, { useCallback, useMemo } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { cn } from "../lib/utils";
import BackgroundProvider from "../app/providers/BackgroundProvider";
import Image from "next/image";
import { useAppSelector } from "../lib/hooks/redux";
import useGame from "../lib/hooks/useGame";

export interface QuestionResultsProps {
  className?: string;
}

interface ProgressBorderProps {
  children: React.ReactNode;
  progress: number; // Progress value expected to be between 0 and 100
}

const ProgressBorder: React.FC<ProgressBorderProps> = ({
  children,
  progress,
}) => {
  // Ensure that the progress never exceeds 100% or drops below 0%
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="relative">
      <div className="absolute inset-0">
        <div
          className="border-4 border-transparent"
          style={{
            borderImage: `linear-gradient(to right, #4caf50 ${normalizedProgress}%, transparent ${normalizedProgress}%) 1`,
          }}
        ></div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
};

export default function QuestionResultsComponent({
  className,
}: QuestionResultsProps) {
  const { isCurrentQuestionAnsweredCorrectly, getStage } = useGame();

  const isQuestionEndedStage = useMemo(
    () => getStage() === "question-ended",
    [getStage],
  );

  const isCorrectAnswer = useMemo(
    () => isQuestionEndedStage && isCurrentQuestionAnsweredCorrectly(),
    [isQuestionEndedStage],
  );

  const Text = useCallback(() => {
    const classNameText = "text-2xl font-semibold text-center";
    if (isCorrectAnswer) {
      return (
        <span className={classNameText}>
          You did it all <br />
          too well!
        </span>
      );
    } else {
      return (
        <span className={classNameText}>
          Everyone of us has <br />
          messed up too
        </span>
      );
    }
  }, [isCorrectAnswer]);

  const imageSrc = useMemo(() => {
    if (isCorrectAnswer) {
      return "/correct-answer.png";
    } else {
      return "/incorrect-answer.png";
    }
  }, [isCorrectAnswer]);

  return (
    <Dialog open={isQuestionEndedStage}>
      <DialogContent
        closeOnOutsideClick={false}
        className={cn(
          "w-[90%] flex flex-col items-center justify-center !p-0 border-4 rounded-3xl",
          className,
          { "border-question-correct": isCorrectAnswer },
          { "border-question-incorrect": !isCorrectAnswer },
        )}
      >
        <BackgroundProvider className="w-full h-full flex flex-col justify-center items-center gap-8 rounded-3xl px-10 py-9">
          <Image
            src={imageSrc}
            alt={isCorrectAnswer ? "Correct answer" : "Incorrect answer"}
            fill
            className="!relative  flex flex-shrink-0 !w-56 !h-56 rounded-full object-cover"
          />
          <Text />
        </BackgroundProvider>
      </DialogContent>
    </Dialog>
  );
}
