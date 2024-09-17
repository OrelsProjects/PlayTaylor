"use client";

import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { montserratAlternates } from "@/lib/utils/fontUtils";
import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector } from "@/lib/hooks/redux";
import { Game, isGameRunning } from "@/models/game";
import useGame from "@/lib/hooks/useGame";
import { useCustomRouter } from "@/lib/hooks/useCustomRouter";

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
  const { game, counters } = useAppSelector(state => state.game);
  const { user } = useAppSelector(state => state.auth);
  const { setPreviouslyJoinedGame } = useGame();
  const [count, setCount] = useState(1);

  const handleNewCounter = (newCount?: number | null, newGame?: Game) => {
    if (newCount === count) return;
    if (!game && !newGame) return;

    const validCount =
      newCount === null || newCount === undefined ? 4 : newCount;
    setCount(validCount);

    const validRoom = (newGame ? newGame : game) as Game;

    if (isGameRunning(validRoom.stage)) {
      if (validCount <= 1) {
        onCountdownZero();
      }
    }
  };

  useEffect(() => {
    if (!user) return;
    setPreviouslyJoinedGame(code, user.userId).then(gameSession => {
      if (!gameSession) return;
      const { game: newGame } = gameSession;
      handleNewCounter(counters.startGame, newGame);
    });
  }, [code, user]);

  useEffect(() => {
    if (counters) {
      handleNewCounter(counters.startGame);
    }
  }, [game, counters]);

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
  const router = useCustomRouter();
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
