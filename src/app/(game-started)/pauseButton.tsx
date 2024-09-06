"use client";
import React, { useMemo } from "react";
import { BsFillPauseFill } from "react-icons/bs";
import { useAppSelector } from "@/lib/hooks/redux";
import { Button } from "@/components/ui/button";
import { FaPlay } from "react-icons/fa";
import useGame from "@/lib/hooks/useGame";
import { canShowPauseButton, isPaused } from "@/models/game";

export const PauseButton = () => {
  const { pauseGame, resumeGame, loadingGameState } = useGame();
  const { user } = useAppSelector(state => state.auth);
  const { game } = useAppSelector(state => state.game);
  const { room } = useAppSelector(state => state.room);

  const isOwner = useMemo(() => {
    return room?.createdBy === user?.userId;
  }, [game, user]);

  const code = useMemo(() => {
    return room?.code || "";
  }, [game]);

  return (
    canShowPauseButton(game?.stage) &&
    isOwner && (
      <Button
        className="h-fit w-fit px-3 py-3 self-center flex justify-center items-center"
        isLoading={loadingGameState}
        loadingClassName="w-7 h-7"
        onClick={() => {
          if (isPaused(game?.stage)) {
            resumeGame(code);
          } else {
            pauseGame(code);
          }
        }}
      >
        {isPaused(game?.stage) ? (
          <FaPlay className="w-7 h-7" />
        ) : (
          <BsFillPauseFill className="w-7 h-7" />
        )}
      </Button>
    )
  );
};
