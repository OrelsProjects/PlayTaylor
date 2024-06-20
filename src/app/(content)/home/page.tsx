"use client";

import React from "react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import Carousel from "../../../components/ui/carousel";
import { useTheme } from "next-themes";

export default function Home() {
  const { setTheme, resolvedTheme } = useTheme();
  const [selectedGame, setSelectedGame] = React.useState<
    "swipe" | "trivia" | "sing-the-lyrics"
  >("swipe");

  return (
    <div className="h-full w-full flex flex-col justify-center gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="w-full h-fit flex justify-center items-center text-start title-main">
          Players gonna play, play...
        </h1>
        <span className="text-primary">Choose a game:</span>
      </div>
      <Carousel
        items={[
          { value: "Mastermind", image: "/Mastermind.png" },
          { value: "The manuscript", image: "/Manuscript.png" },
          { value: "Cassandra", image: "/Cassandra.png" },
        ]}
        onItemSelected={item => {
          let newTheme = "light";
          if (item.value === "Mastermind") {
            newTheme = "sun";
            setSelectedGame("swipe");
          } else if (item.value === "The manuscript") {
            newTheme = "blossom";
            setSelectedGame("sing-the-lyrics");
          } else if (item.value === "Cassandra") {
            newTheme = "midnight";
            setSelectedGame("trivia");
          }
          if (resolvedTheme !== "dark") {
            setTheme(newTheme);
          }
        }}
      />
      <Button asChild className="w-fit self-end mt-auto">
        <Link href={`/games/${selectedGame}`}>Play</Link>
      </Button>
    </div>
  );
}
