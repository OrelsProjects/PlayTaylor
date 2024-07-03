"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import Carousel from "../../../components/ui/carousel";
import useGame from "../../../lib/hooks/useGame";
import { QuestionType } from "../../../models/question";
import GameFinishedComponent from "../../../components/ui/gameFinished";

const carouselItems = [
  { title: "Mastermind", value: "trivia", image: "/Mastermind.png" },
  {
    title: "The manuscript",
    value: "sing-the-lyrics",
    image: "/Manuscript.png",
  },
  { title: "Cassandra", value: "swipe", image: "/Cassandra.png" },
];

const carouselTitles = [
  {
    title: "Mastermind",
    value: "Is your English level as good as our fav blondie?",
  },
  {
    title: "The manuscript",
    value: "Prove us that you remember the songs all too well!",
  },
  {
    title: "Cassandra",
    value: "Is it true love or a false god?",
  },
];

export default function Home() {
  const { game, setGame } = useGame();
  const [defaultSelected, setDefaultSelected] = useState(1);

  useEffect(() => {
    const selected = carouselItems.findIndex(item => item.value === game);
    if (selected !== -1) {
      setDefaultSelected(selected);
    }
  }, [game]);

  const title = useMemo(() => {
    return carouselTitles[defaultSelected];
  }, [defaultSelected]);

  return (
    <div className="h-full w-full flex flex-col justify-center gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="w-full h-fit flex justify-center items-center text-start title-main">
          Players gonna play, play...
        </h1>
        <span className="text-primary">Choose a game:</span>
      </div>
      <div className="flex flex-col gap-2 mb-20">
        <Carousel
          selected={defaultSelected}
          items={carouselItems}
          onItemSelected={item => {
            setGame(item.value as QuestionType);
          }}
        />
        <span className="text-primary h-5">{title.value}</span>
      </div>
      <Button asChild className="w-fit self-end">
        <Link href={`/instructions`}>Play</Link>
      </Button>
    </div>
  );
}
