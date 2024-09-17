"use client";
import React, { useCallback, useEffect, useMemo } from "react";
import { BsFillPauseFill } from "react-icons/bs";
import { useAppSelector } from "@/lib/hooks/redux";
import { Button } from "@/components/ui/button";
import { FaPlay } from "react-icons/fa";
import { FaRedoAlt } from "react-icons/fa";
import useGame from "@/lib/hooks/useGame";
import { canShowPauseButton, isPaused } from "@/models/game";
import { toast } from "react-toastify";

export type GameStateButtonType = "pause" | "resume" | "restart";

export const GameStateButton = () => {
  const { pauseGame, resumeGame, loadingGameState, restartGame } = useGame();
  const { game } = useAppSelector(state => state.game);
  const { room } = useAppSelector(state => state.room);

  const code = useMemo(() => {
    return room?.code || "";
  }, [game]);

  const type = useMemo((): GameStateButtonType => {
    const stage = game?.stage;

    if (!stage || stage === "paused") {
      return "pause";
    } else if (stage === "game-ended") {
      return "restart";
    }
    return "resume";
  }, [game]);

  const canShowButton = useMemo(() => {
    if (!room.isAdmin) return false;
    if (type === "pause" || type === "resume") {
      return canShowPauseButton(game?.stage);
    } else if (type === "restart") {
      return game?.stage === "game-ended";
    }
    return false;
  }, [game, room.isAdmin, type]);

  const handleButtonClick = async () => {
    try {
      if (type === "restart") {
        await restartGame(code);
        return;
      }
      if (isPaused(game?.stage)) {
        await resumeGame(code);
      } else {
        await pauseGame(code);
      }
    } catch (error) {
      const text =
        type === "restart"
          ? "Failed to restart game"
          : game?.stage === "paused"
            ? "Failed to resume game"
            : "Failed to pause game";
      toast.error(text);
    }
  };

  const ButtonIcon = useCallback(() => {
    switch (type) {
      case "pause":
        return <FaPlay className="w-7 h-7" />;
      case "restart":
        return <FaRedoAlt className="w-7 h-7 transform rotate-180" />;
      case "resume":
        return <BsFillPauseFill className="w-7 h-7" />;
      default:
        return <BsFillPauseFill className="w-7 h-7" />;
    }
  }, [type]);

  return (
    canShowButton && (
      <div className="flex flex-col justify-center items-center gap-2">
        <Button
          className="h-fit w-fit px-3 py-3 self-center flex justify-center items-center"
          isLoading={loadingGameState}
          loadingClassName="w-7 h-7"
          onClick={handleButtonClick}
        >
          {<ButtonIcon />}
        </Button>
        {type === "restart" && (
          <p className="text-accent font-medium">Begin again</p>
        )}
      </div>
    )
  );
};
