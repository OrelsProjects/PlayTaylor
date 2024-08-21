"use client";

import React, { useEffect } from "react";
import ParticipantsComponent from "@/components/pariticpantsComponent";
import useRoom from "@/lib/hooks/useRoom";
import { db } from "@/../firebase.config";
import { doc, onSnapshot } from "firebase/firestore";
import Room from "@/models/room";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function AdminRoomPage({
  params,
}: {
  params: { code: string };
}) {
  const router = useRouter();
  const [roomInitialized, setRoomInitialized] = React.useState(false);
  const { listenToRoomChanges, startGame, setPreviouslyCreatedRoom } =
    useRoom();

  const initRoom = async () => {
    try {
      await setPreviouslyCreatedRoom(params.code);
      setRoomInitialized(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    initRoom();
  }, [params.code]);

  useEffect(() => {
    let unsubscribe = () => {};
    if (roomInitialized) {
      if (db) {
        unsubscribe = listenToRoomChanges(params.code, newRoom => {
          if (newRoom?.gameStartedAt) {
            router.push(`/game/${params.code}`);
          }
        });
      }
    }
    return unsubscribe;
  }, [roomInitialized]);

  const handleStartGame = async () => {
    const toastId = toast.loading("Starting game...");
    try {
      await startGame(params.code);
      router.push(`/game/${params.code}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to start game");
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-8 justify-center items-center mt-11">
      <ParticipantsComponent
        code={params.code}
        onCountdownStarted={() => {}}
        className=""
      />
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
