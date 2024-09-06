import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface PlayerCardProps {
  rank: number;
  image: string;
  name: string;
  isCorrectAnswer?: boolean;
}

export default function PlayerCard({
  rank,
  image,
  name,
  isCorrectAnswer,
}: PlayerCardProps) {
  const isRankedFirst = useMemo(() => rank === 1, [rank]);

  return (
    <div
      className={cn(
        "w-full h-16 rounded-2xl flex items-center justify-start gap-3 px-4 py-[18.5px] text-primary-foreground",
        { "bg-primary": isRankedFirst },
        { "gradient-purple": !isRankedFirst },
      )}
    >
      <span className="font-medium text-lg">{rank}</span>
      <div className="flex flex-row gap-1 justify-start items-center">
        <Image
          src={image}
          alt={name}
          width={28}
          height={28}
          className={cn(
            "rounded-full border-2 object-cover",
            { "border-question-correct": isCorrectAnswer },
            {
              "border-question-incorrect": !isCorrectAnswer,
            },
          )}
        />
        <span className="text-xs">{name}</span>
      </div>
    </div>
  );
}
