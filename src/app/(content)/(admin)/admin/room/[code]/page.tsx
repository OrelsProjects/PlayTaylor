"use client";

import React, { useEffect, useRef } from "react";
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
  const { user } = useAppSelector(state => state.auth);
  const { game, counters } = useAppSelector(state => state.game);
  const { startGame, setPreviouslyJoinedGame } = useGame();
  const startGameToastId = useRef<number | string>(-1);

  const initRoom = async () => {
    try {
      if (!user) return;
      await setPreviouslyJoinedGame(params.code, user.userId);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // update toast text based on counter
    game?.countdownStartedAt &&
      counters.startGame &&
      toast.update(startGameToastId.current, {
        render: "Starting game in: " + counters.startGame + " seconds",
      });
  }, [counters.startGame, game?.countdownStartedAt]);

  useEffect(() => {
    initRoom();
  }, [params.code, user]);

  useEffect(() => {
    if (game?.stage === "playing") {
      router.push(`/game/${params.code}`);
    }
  }, [game]);

  const handleStartGame = async () => {
    startGameToastId.current = toast.loading("Starting game...");
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
      toast.dismiss(startGameToastId.current);
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
