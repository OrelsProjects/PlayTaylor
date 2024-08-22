"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { montserratAlternates } from "@/lib/utils/fontUtils";
import { AnimatePresence, motion } from "framer-motion";
import useRoom from "@/lib/hooks/useRoom";
import { useRouter } from "next/navigation";
import { isGameStarted } from "@/models/gameStage";
import { useAppSelector } from "@/lib/hooks/redux";
import Room from "@/models/room";

const leftToRightAnimation = {
  initial: { x: "-100%", opacity: 0, transition: { duration: 0.3 } },
  animate: { x: 0, opacity: 1 },
  exit: { x: "100%", y: -1000, opacity: 0, transition: { duration: 0.0 } },
};

const Counter = ({
  code,
  onCountdownZero,
}: {
  code: string;
  onCountdownZero: () => void;
}) => {
  const { room } = useAppSelector(state => state.room);

  const { setPreviouslyJoinedRoom } = useRoom();
  const [count, setCount] = useState(1);

  const handleNewCounter = (newCount?: number | null, newRoom?: Room) => {
    if (!room && !newRoom) return;

    const validCount = newCount === null || newCount === undefined ? 4 : newCount;

    setCount(validCount);

    const validRoom = (newRoom ? newRoom : room) as Room;

    if (isGameStarted(validRoom.stage)) {
      if (validCount <= 1) {
        onCountdownZero();
      }
    }
  };
  useEffect(() => {
    setPreviouslyJoinedRoom(code).then(response => {
      if (!response) return;
      const { room: newRoom } = response;
      handleNewCounter(newRoom.countdownCurrentTime, newRoom);
    });
  }, [code]);

  useEffect(() => {
    if (room) {
      handleNewCounter(room.countdownCurrentTime);
    }
  }, [room]);

  const countText = useMemo(() => (count <= 4 ? count : null), [count]);

  return (
    <AnimatePresence>
      <motion.span
        {...leftToRightAnimation}
        key={countText}
        className="text-[56px] leading-[56px] font-bold"
      >
        {countText}
      </motion.span>
    </AnimatePresence>
  );
};

export default function Lobby({ params }: { params: { code: string } }) {
  const router = useRouter();
  const [countdownZero, setCountdownZero] = useState(false);

  const title = useMemo(
    () =>
      !countdownZero ? (
        <>
          Are you ready <br /> for it?
        </>
      ) : (
        <>
          Let&apos;s see you <br /> tough kids
        </>
      ),
    [countdownZero],
  );

  return (
    <div
      className={cn(
        "h-full w-full flex flex-col items-center justify-center gap-16 relative",
        montserratAlternates.className,
      )}
    >
      <Counter
        code={params.code}
        onCountdownZero={() => {
          if (countdownZero) return;
          setCountdownZero(true);
          router.push(`/game/${params.code}`);
        }}
      />
      <motion.span
        {...leftToRightAnimation}
        // spring
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        key={`title-${!countdownZero ? "ready" : "tough"}`}
        className="text-[40px] leading-10 text-center absoltue"
      >
        {title}
      </motion.span>
    </div>
  );
}
