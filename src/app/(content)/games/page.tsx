import React from "react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

const GamePage: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-row justify-center items-center gap-2">
      <Button asChild className=" h-20 w-20 rounded-lg">
        <Link href="/games/trivia">Trivia</Link>
      </Button>
      <Button asChild className=" h-20 w-20 rounded-lg">
        <Link href="/games/swipe">Swipe</Link>
      </Button>
    </div>
  );
};

export default GamePage;
