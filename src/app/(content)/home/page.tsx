import React from "react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full w-full flex flex-col justify-center">
      <h1 className="w-full h-full flex justify-center items-center text-start title-main">
        Players gonna play, play...
      </h1>
      <Button asChild className="w-fit self-end">
        <Link href="/instructions">Play</Link>
      </Button>
    </div>
  );
}
