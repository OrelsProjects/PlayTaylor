"use client";

import React, { useEffect } from "react";
import ParticipantsComponent from "@/components/pariticpantsComponent";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useAppSelector } from "@/lib/hooks/redux";
import useGame from "@/lib/hooks/useGame";
import { useCustomRouter } from "@/lib/hooks/useCustomRouter";

export default function AdminRoomPage({
  params,
}: {
  params: { code: string };
}) {
  const router = useCustomRouter();
  const { game } = useAppSelector(state => state.game);
  const { startGame, setPreviouslyJoinedGame } = useGame();

  const initRoom = async () => {
    try {
      await setPreviouslyJoinedGame(params.code);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    initRoom();
  }, [params.code]);

  useEffect(() => {
    if (game?.gameStartedAt) {
      router.push(`/game/${params.code}`);
    }
  }, [game]);

  const handleStartGame = async () => {
    const toastId = toast.loading("Starting game...");
    try {
      await startGame(params.code);
      router.push(`/game/${params.code}`);
    } catch (error: any) {
      if (error.name === "NoParticipantsError") {
        toast.error("You need at least 1 participant to start the game");
        return;
      }
      if (error.name === "LoadingError") {
        return;
      }
      console.error(error);
      toast.error("Failed to start game");
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-8 justify-center items-center mt-11">
      <ParticipantsComponent />
      <Button
        onClick={() => {
          handleStartGame();
        }}
      >
        Let&apos;s play, play, play
      </Button>
    </div>
  );
}
