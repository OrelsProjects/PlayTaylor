"use client";

import React from "react";
import { InstructionItem, instructionItems } from "./_consts";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import {
  Difficulty,
  setDifficulty,
} from "../../../lib/features/game/gameSlice";
import { useAppDispatch, useAppSelector } from "../../../lib/hooks/redux";
import { cn } from "../../../lib/utils";

const InstructionsItem: React.FC<InstructionItem> = ({
  title,
  description,
  itemNumber,
}) => {
  return (
    <div className="w-full flex flex-row justify-start gap-4 py-3 px-4">
      <div className="w-10 h-10 flex justify-center items-center flex-shrink-0 rounded-full bg-foreground text-primary dark:text-background">
        {itemNumber}
      </div>
      <div className="w-full flex flex-col">
        <h2 className="text-base font-bold">{title}</h2>
        <p className="text-sm text-primary">{description}</p>
      </div>
    </div>
  );
};

const allDifficulties: Difficulty[] = ["debut", "midnights", "folklore"];

const InstructionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { difficulty: selectedDifficulty } = useAppSelector(
    state => state.game,
  );

  return (
    <div className="h-full w-full flex flex-col gap-16">
      <div className="w-full flex flex-col gap-9">
        <h1 className="w-full text-center">How to play</h1>
        <div className="flex flex-col">
          {instructionItems.map(item => (
            <InstructionsItem key={item.title} {...item} />
          ))}
        </div>
      </div>
      <div className="w-full flex flex-col gap-6">
        <h2 className="w-full text-center">Difficulty level</h2>
        <div className="w-full h-fit relative flex flex-row justify-center items-center gap-7 px-1.5 py-5">
          {allDifficulties.map(difficulty => (
            <div
              key={difficulty}
              onClick={() => dispatch(setDifficulty(difficulty))}
              className={cn(
                "w-fit relative text-muted-foreground p-2.5 py-1.5",
                {
                  "text-primary border-primary border-[1px] rounded-full":
                    selectedDifficulty === difficulty,
                },
              )}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </div>
          ))}
        </div>
      </div>
      <Button asChild className="w-fit self-center mt-auto">
        <Link href="/games">I am ready for it!</Link>
      </Button>
    </div>
  );
};

export default InstructionsPage;
