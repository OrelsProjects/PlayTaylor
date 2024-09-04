"use client";
import React, { useEffect } from "react";
import { useAppSelector } from "@/lib/hooks/redux";
import { cn } from "@/lib/utils";
import { montserratAlternates } from "@/lib/utils/fontUtils";
import ParticipantsComponent from "@/components/pariticpantsComponent";
import { useCustomRouter } from "@/lib/hooks/useCustomRouter";
import { isGameStarted } from "@/models/game";

export default function Waiting({ params }: { params: { code?: string } }) {
  const router = useCustomRouter();
  const { game } = useAppSelector(state => state.game);

  useEffect(() => {
    if (game && isGameStarted(game.stage)) {
      router.push(`/lobby/${params.code}`);
    }
  }, [game]);

  return (
    <div
      className={cn(
        "h-full w-full flex flex-col items-center justify-start gap-16 px-14 py-10",
        montserratAlternates.className,
      )}
    >
      <div className="w-full h-full flex flex-col gap-8 justify-center items-center">
        <ul className="w-full h-full flex flex-row gap-2 justify-center items-center relative">
          <ParticipantsComponent />
        </ul>
      </div>
      <div>Waiting room</div>
    </div>
  );
}
