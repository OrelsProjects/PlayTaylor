"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import BarsComponent, { BarItem } from "./bars";
import { useAppSelector } from "@/lib/hooks/redux";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { calculateFinalScore } from "./utils";

const items = [
  {
    name: "Marcus",
    image: "/correct-answer.png",
    points: 150,
  },
  {
    name: "Sophia",
    image: "/incorrect-answer.png",
    points: 101,
  },
  { name: "Chloe", image: "/swiftie.png", points: 41 },
  { name: "Sam", image: "/swiftie.png", points: 40 },
];

const Top3Component = ({
  items,
  onTopShown,
}: {
  items: BarItem[];
  onTopShown: () => void;
}) => <BarsComponent items={items} onTopShown={onTopShown} />;

export default function ResultsPage({ params }: { params: { code: string } }) {
  const { participants } = useAppSelector(state => state.game);
  const [showOthers, setShowOthers] = React.useState(false);

  const rankedParticipants = useMemo(() => {
    if (!participants) return [];
    return (
      participants
        .map(participant => {
          const correctResponses = participant.questionResponses?.filter(
            response => response.correct,
          );
          return {
            ...participant,
            points: calculateFinalScore(correctResponses || []),
          };
        })
        .sort((a, b) => b.points - a.points)
        //BarItem
        .map((participant, index) => ({
          name: participant.name,
          image: "/correct-answer.png",
          points: participant.points,
          rank: index + 1,
        }))
    );
  }, [participants]);

  const top3Participants = useMemo(
    () => rankedParticipants.slice(0, 3),
    [participants],
  );

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-auto">
      <Top3Component
        items={top3Participants}
        onTopShown={() => setShowOthers(true)}
      />
      <div className="w-full h-60">
        {showOthers && (
          <motion.div
            // animate fade
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            key="rest-of-participants"
            className="w-full h-fit grid grid-cols-[repeat(var(--players-in-row-mobile),minmax(0,1fr))] md:grid-cols-[repeat(var(--players-in-row),minmax(0,1fr))] gap-4 auto-rows-auto pb-4"
          >
            {top3Participants.map((participant, index) => (
              <Card
                key={`${participant.name}-${index}`}
                className="flex flex-row items-center justify-start gap-2 bg-background shadow-xl py-4 px-4 border-none"
              >
                <p className="font-medium text-secondary">{index + 1}</p>
                <Image
                  src={participant.image}
                  alt={`ranking image for ${participant.name}`}
                  fill
                  className={cn(
                    "!relative rounded-full flex-shrink-0 !h-8 !w-8 object-cover",
                  )}
                />
                <p className="text-sm font-nomral text-secondary line-clamp-2">
                  {participant.name}
                </p>
              </Card>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
