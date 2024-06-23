"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import Carousel from "../../../components/ui/carousel";
import useGame from "../../../lib/hooks/useGame";
import { Game } from "../../../lib/features/game/gameSlice";
import AdTrivia from "../../../components/ads/adTrivia";

const carouselItems = [
  { title: "Mastermind", value: "trivia", image: "/Mastermind.png" },
  {
    title: "The manuscript",
    value: "sing-the-lyrics",
    image: "/Manuscript.png",
  },
  { title: "Cassandra", value: "swipe", image: "/Cassandra.png" },
];

export default function Home() {
  const { game, setGame } = useGame();
  const [defaultSelected, setDefaultSelected] = useState(0);

  useEffect(() => {
    const selected = carouselItems.findIndex(item => item.value === game);
    if (selected !== -1) {
      setDefaultSelected(selected);
    }
  }, [game]);

  return (
    <div className="h-full w-full flex flex-col justify-center gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="w-full h-fit flex justify-center items-center text-start title-main">
          Players gonna play, play...
        </h1>
        <span className="text-primary">Choose a game:</span>
      </div>
      <Carousel
        selected={defaultSelected}
        items={carouselItems}
        onItemSelected={item => {
          setGame(item.value as Game);
        }}
      />
      <AdTrivia />
      <Button asChild className="w-fit self-end mt-auto">
        <Link href={`/instructions`}>Play</Link>
      </Button>
    </div>
  );
}
