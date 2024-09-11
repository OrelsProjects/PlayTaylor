"use client";

import Image from "next/image";
import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { montserratAlternates } from "@/lib/utils/fontUtils";
import { motion } from "framer-motion";

const MAX_BAR_HEIGHT = 320;
const MIN_BAR_HEIGHT = 120;

//bg-gradient-to-r from-[hsla(239,86%,74%,1)] to-[hsla(252,88%,74%,1)];
const classNameFirst = "gradient-purple-to-b shadow-xl";
const classNameSecondOrThird = "gradient-purple-to-b-80";

type Rank = 1 | 2 | 3;

export interface BarItem {
  name: string;
  image: string;
  points: number;
}

type BarItemWithExtras = BarItem & { height: number; rank: Rank };

export interface BarsComponentProps {
  items: BarItem[];
  onTopShown?: () => void;
}

const BarComponent = ({
  bar,
  className,
  onTopShown,
}: {
  className?: string;
  bar: BarItemWithExtras;
  onTopShown?: () => void;
}) => {
  const [showScore, setShowScore] = React.useState(false);

  return (
    <div
      className={cn(
        "w-full h-[350px] xs:h-[450px] flex flex-col items-center justify-end gap-4",
        montserratAlternates.className,
        className,
      )}
    >
      <Image
        src={bar.image}
        alt={`ranking image for ${bar.name}`}
        fill
        className={cn("!relative rounded-full flex-shrink-0 object-cover", {
          "!h-[72px] !w-[72px]": bar.rank === 1,
          "!h-14 !w-14": bar.rank === 2 || bar.rank === 3,
        })}
      />
      <p
        className={cn("text-secondary font-medium text-center line-clamp-2", {
          "font-semibold": bar.rank === 1,
        })}
      >
        {bar.name}
      </p>
      {/* Wrapper for bar to make sure it grows upwards */}
      <div className="w-full flex items-end">
        <motion.div
          className={cn(
            "rounded-t-3xl relative flex-shrink-0 w-full max-h-[200px] xs:max-h-[320px]",
            {
              [classNameFirst]: bar.rank === 1,
              [classNameSecondOrThird]: bar.rank === 2 || bar.rank === 3,
            },
          )}
          animate={{ height: bar.height, transition: { duration: 1.6 } }}
          onAnimationComplete={() => setShowScore(true)}
        >
          {showScore && (
            <motion.div
              className={cn(
                "absolute inset-x-0 flex flex-col justify-center items-center gap-2 text-white text-lg font-bold",
                {
                  "top-8": bar.rank === 1,
                  "top-6": bar.rank === 2,
                  "top-4": bar.rank === 3,
                },
              )}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.2, delay: 0.5 },
              }}
              onAnimationComplete={() => onTopShown?.()}
            >
              <p className="text-xl font-bold">{bar.rank}</p>
              <p className="text-sm font-semibold">{bar.points}pt</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default function BarsComponent({
  items,
  onTopShown,
}: BarsComponentProps) {
  const ranking = useMemo(() => {
    return items.sort((a, b) => b.points - a.points).slice(0, 3);
  }, [items]);

  // ranking bar heights. The highest points  will have the max height. the rest will be proportional
  const rankingBarHeights = useMemo((): BarItemWithExtras[] => {
    if (ranking.length === 0) {
      return [];
    }
    const maxPoints = ranking[0].points;

    // Ranking the top 3 players, starting with the second highest points, then the highest points, then the third highest points
    let barsOrderRanking: (BarItem & { rank: Rank })[] = [];
    if (ranking.length === 1) {
      barsOrderRanking = [{ ...ranking[0], rank: 1 }];
    } else if (ranking.length === 2) {
      barsOrderRanking = [
        { ...ranking[1], rank: 2 },
        { ...ranking[0], rank: 1 },
      ];
    } else if (ranking.length === 3) {
      barsOrderRanking = [
        { ...ranking[1], rank: 2 },
        { ...ranking[0], rank: 1 },
        { ...ranking[2], rank: 3 },
      ];
    }
    return barsOrderRanking.map((bar, index) => {
      let barHeight = (bar.points / maxPoints) * MAX_BAR_HEIGHT;
      barHeight = Math.max(barHeight, MIN_BAR_HEIGHT);

      return {
        ...bar,
        height: barHeight,
      };
    });
  }, [ranking]);

  return (
    <div className="w-full h-fit flex justify-center items-center">
      <div className="w-full flex flex-row justify-center">
        {rankingBarHeights.map((bar, index) => (
          <BarComponent
            className="max-w-[33%]"
            key={`bar-${bar.name}`}
            bar={bar}
            onTopShown={index === 0 ? onTopShown : undefined}
          />
        ))}
      </div>
    </div>
  );
}
