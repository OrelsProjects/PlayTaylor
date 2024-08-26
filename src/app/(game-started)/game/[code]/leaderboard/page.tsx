"use client";

import React, { useMemo } from "react";
import { useAppSelector } from "@/lib/hooks/redux";
import PlayerCard from "./playerCard";
import { montserratAlternates } from "@/lib/utils/fontUtils";
import { cn } from "../../../../../lib/utils";

export default function LeaderboardPage({
  params,
}: {
  params: { code: string };
}) {
  const { room } = useAppSelector(state => state.room); // FOR NEXT - Change CODE params to search params and use useCUstomRouter form saas-template

  const currentQuestion = useMemo(() => {
    if (!room) return null;
    return room.currentQuestion;
  }, [room]);

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col gap-[71px] justify-center items-center px-4",
        montserratAlternates.className,
      )}
    >
      <div className="w-full flex flex-col gap-8 justify-center items-center">
        <span className="text-2xl font-semibold text-center">
          {currentQuestion?.title || "What was Taylor’s debut single?"}
        </span>
        <div className="w-full relative">
          <div className="w-full bg-question-correct flex justify-center items-center rounded-2xl py-5 z-20 relative">
            {/* Make a square with rounded-lg, rotate 90 deg and set absolute middle bottom*/}
            <span className=" text-primary-foreground z-20">
              Tim McGraw
            </span>
            <div className="w-10 h-10 bg-question-correct rounded-[4px] transform rotate-45 absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-10"></div>
          </div>
        </div>
      </div>
      <div className="w-full h-full grid grid-cols-[repeat(var(--players-in-row-mobile),minmax(0,1fr))] md:grid-cols-[repeat(var(--players-in-row),minmax(0,1fr))] gap-4 auto-rows-auto">
        {Array.from({ length: 4 }).map((_, index) => (
          <PlayerCard
            key={index}
            rank={index + 1}
            image={"/swiftie.png"}
            name={"TayTay"}
            isCorrectAnswer={index < 2}
          />
        ))}
      </div>
    </div>
  );
}
