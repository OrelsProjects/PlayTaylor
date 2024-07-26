"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";


export default function Home() {
  const router = useRouter();

  return (
    <main className="h-svh w-full flex flex-col items-center justify-start gap-16">
      <div className="flex flex-col gap-6">
        <h1 className="font-stalemate font-thin text-foreground text-8xl mt-52">
          Play Taylor
        </h1>
        <p className="text-center mt-">
          Play with your fellow Swifties, <br /> and let&apos;s see who&apos;s
          the greatest
          <br />
          Swiftie of all time!
        </p>
      </div>
      <div className="flex flex-row gap-6">
        <Button variant="success" onClick={() => router.push("/room")}>
          Start a New Game
        </Button>
        <Button onClick={() => router.push("/join")}>Join Game</Button>
      </div>

    </main>
  );
}
