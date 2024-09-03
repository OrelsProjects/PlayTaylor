"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { montserratAlternates } from "@/lib/utils/fontUtils";
import { cn } from "../lib/utils";
import { LOCAL_STORAGE_PREFIX } from "../lib/hooks/_utils";

export default function Home() {
  const router = useRouter();

  return (
    <main
      className={cn(
        "h-svh w-full flex flex-col items-center justify-start gap-16",
        montserratAlternates.className,
      )}
    >
      <div className="flex flex-col gap-6">
        <span className="font-thin text-foreground text-[40px] leading-[40px] mt-52 text-center">
          Play Taylor
        </span>
        <p className="text-center text-xl mt-">
          Play with your fellow Swifties, <br /> and let&apos;s see who&apos;s
          the greatest
          <br />
          Swiftie of all time!
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <Button
          onClick={() => {
            Object.keys(localStorage)
              .filter(key => {
                const prefix = `${LOCAL_STORAGE_PREFIX}_`;
                return key.includes(prefix);
              })
              .forEach(key => localStorage.removeItem(key));

            router.push("/admin/room/create");
          }}
        >
          Start a New Game
        </Button>
        <Button variant="outline" onClick={() => router.push("/join")}>
          Join Game
        </Button>
      </div>
      {/* <QuestionResultsComponent isCorrectAnswer={false} open /> */}
    </main>
  );
}
