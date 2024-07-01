import React, { useMemo } from "react";
import { Button } from "./button";
import Link from "next/link";
import { Icons } from "./icons";

interface GameFinishedComponentProps {
  questionsCount: number;
  correctAnswers: number;
}

const GameFinishedComponent: React.FC<GameFinishedComponentProps> = ({
  questionsCount,
  correctAnswers,
}) => {
  const score = useMemo(
    () => Math.ceil((correctAnswers / questionsCount) * 100),
    [correctAnswers, questionsCount],
  );

  const message = useMemo(() => {
    if (score === 100) {
      return "Perfect!";
    } else if (score > 80) {
      return "Great job!";
    } else if (score > 60) {
      return "Good job!";
    } else {
      return "You can do better!";
    }
  }, [score]);

  return (
    <div className="flex flex-col gap-24">
      <div className="flex flex-col gap-8 justify-center items-center">
        <h1>{message}</h1>
        <div></div>
        <h3 className="text-center">
          Your score:
          <br />
          {score}
        </h3>
      </div>
      <div className="flex flex-col justify-center items-center gap-2">
        <Button asChild>
          <Link href={`/home`}>Next game</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/home`} className="flex flex-row gap-2">
            <Icons.Redo className="fill-primary h-4 w-4" />
            <span className="text-primary">Redo</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default GameFinishedComponent;
