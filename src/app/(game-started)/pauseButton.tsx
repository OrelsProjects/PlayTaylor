"use client";
import React, { useMemo } from "react";
import { useAppSelector } from "../../lib/hooks/redux";
import { Button } from "../../components/ui/button";
import { FaPlay } from "react-icons/fa";
import { BsFillPauseFill } from "react-icons/bs";
import useRoom from "../../lib/hooks/useRoom";

export const PauseButton = () => {
  const { pauseGame, resumeGame, loadingGameState } = useRoom();
  const { user } = useAppSelector(state => state.auth);
  const { room } = useAppSelector(state => state.room);

  const isOwner = useMemo(() => {
    return room?.createdBy === user?.userId;
  }, [room, user]);

  const code = useMemo(() => {
    return room?.code || "";
  }, [room]);

  return (
    isOwner && (
      <Button
        className="h-fit w-fit px-3 py-3 self-center flex justify-center items-center"
        isLoading={loadingGameState}
        loadingClassName="w-7 h-7"
        onClick={() => {
          if (room?.stage === "paused") {
            resumeGame(code);
          } else {
            pauseGame(code);
          }
        }}
      >
        {room?.stage === "paused" ? (
          <FaPlay className="w-7 h-7" />
        ) : (
          <BsFillPauseFill className="w-7 h-7" />
        )}
      </Button>
    )
  );
};
