"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../../../lib/utils";
import { montserratAlternates } from "../../../../lib/utils/fontUtils";
import { AnimatePresence, motion } from "framer-motion";
import useRoom from "../../../../lib/hooks/useRoom";
import Loading from "../../../../components/ui/loading";
import { useRouter } from "next/navigation";

const leftToRightAnimation = {
  initial: { x: "-100%", opacity: 0, transition: { duration: 0.3 } },
  animate: { x: 0, opacity: 1 },
};

export default function Lobby({ params }: { params: { code: string } }) {
  const router = useRouter();
  const { setPreviouslyJoinedRoom } = useRoom();
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(true);

  const interval = useRef<NodeJS.Timeout>();
  useEffect(() => {
    setPreviouslyJoinedRoom(params.code).then(() => {
      setLoading(false);
      interval.current = setInterval(() => {
        setCount(prevCount => {
          if (prevCount < 7) {
            return prevCount + 1;
          } else {
            clearInterval(interval.current);
            router.push("/game/" + params.code);
            return prevCount;
          }
        });
      }, 1000);
    });

    return () => clearInterval(interval.current); // Clean up the interval on component unmount
  }, []);

  const title = useMemo(
    () =>
      count <= 4 ? (
        <>
          Are you ready <br /> for it?
        </>
      ) : (
        <>
          Let&apos;s see you <br /> tough kids
        </>
      ),
    [count],
  );

  const countText = useMemo(() => (count <= 4 ? count : null), [count]);

  if (loading) {
    return <Loading className="w-16 h-16" />;
  }

  return (
    <div
      className={cn(
        "h-full w-full flex flex-col items-center justify-center gap-16 relative",
        montserratAlternates.className,
      )}
    >
      <motion.span
        {...leftToRightAnimation}
        // spring
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        key={`title-${count <= 4 ? "ready" : "tough"}`}
        className="text-[40px] leading-10 text-center absoltue"
      >
        {title}
      </motion.span>
      <AnimatePresence>
        <motion.span
          {...leftToRightAnimation}
          key={countText}
          className="text-[56px] leading-[56px] font-bold"
        >
          {countText}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
