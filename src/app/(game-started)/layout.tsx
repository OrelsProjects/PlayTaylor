"use client";

import React, { useEffect, useState } from "react";
import RoomNameComponent from "@/components/roomName";
import { cn } from "@/lib/utils";
import { montserratAlternates } from "@/lib/utils/fontUtils";
import { useAppSelector } from "@/lib/hooks/redux";
import { PauseButton } from "./pauseButton";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import useGame from "@/lib/hooks/useGame";
import { isGameRunning } from "@/models/game";
import { useCustomRouter } from "@/lib/hooks/useCustomRouter";

//framer-motion
const slideInAnimation = {
  initial: { x: "100%" },
  animate: { x: 0 },
  exit: { x: "-100%" },
};

export default function GameStartedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAppSelector(state => state.auth);
  const router = useCustomRouter();
  const pathname = usePathname();
  const { room } = useAppSelector(state => state.room);
  const { setPreviouslyJoinedGame } = useGame();
  const [loadingJoinPreviousGame, setLoadingJoinPreviousGame] = useState(false);

  useEffect(() => {
    if (!user || !room.code) return;
    if (loadingJoinPreviousGame) return;

    setLoadingJoinPreviousGame(true);
    setPreviouslyJoinedGame(room.code)
      .then(response => {
        if (!response) {
          router.push("/");
        } else {
          router.cancelRoute();
        }
      })
      .catch(() => {
        router.push("/");
      })
      .finally(() => {
        setLoadingJoinPreviousGame(false);
      });
  }, [user, room.code]);

  return (
    <motion.div
      key={pathname}
      className="w-full h-svh flex flex-col"
      variants={slideInAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div
        className={cn(
          "w-full flex flex-col items-center justify-start px-14 py-6 border-[1px] border-b-foreground/15",
          montserratAlternates.className,
        )}
      >
        <RoomNameComponent name={room?.name || ""} type="compact" />
      </div>
      <div className="h-full w-full flex justify-center items-center overflow-auto mt-6 mb-2">
        {children}
      </div>
      <div className="w-full h-fit flex justify-center items-center py-2">
        <PauseButton />
      </div>
    </motion.div>
  );
}
