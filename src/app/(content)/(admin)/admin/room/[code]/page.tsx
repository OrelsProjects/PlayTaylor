"use client";

import React, { useEffect } from "react";
import ParticipantsComponent from "@/components/pariticpantsComponent";
import useRoom from "@/lib/hooks/useRoom";
import { db } from "@/../firebase.config";
import { doc, onSnapshot } from "firebase/firestore";
import Room from "@/models/room";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function AdminRoomPage({
  params,
}: {
  params: { code: string };
}) {
  const [roomInitialized, setRoomInitialized] = React.useState(false);
  const {
    listenDefaults,
    startGame,
    setPreviouslyCreatedRoom,
    loadingCountdown,
  } = useRoom();

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
    if (roomInitialized) {
      let unsubscribe = () => {};
      if (db) {
        const roomRef = doc(db, "rooms", params.code);
        unsubscribe = onSnapshot(
          roomRef,
          snapshot => {
            console.log(
              "Room snapshot",
              (snapshot.data() as Room).countdownCurrentTime,
            );
            listenDefaults.onChange(snapshot.data() as Room);
          },
          error => {},
        );
      }
      return unsubscribe;
    }
  }, [roomInitialized]);

  const handleStartGame = async () => {
    const toastId = toast.loading("Starting game...");
    try {
      await startGame(params.code);
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
        onGameStarted={() => {}}
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
