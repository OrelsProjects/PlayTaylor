"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../../lib/utils";
import { montserratAlternates } from "../../../lib/utils/fontUtils";
import { AnimatePresence, motion } from "framer-motion";

const leftToRightAnimation = {
  initial: { x: "-100%", opacity: 0, transition: { duration: 0.3 } },
  animate: { x: 0, opacity: 1 },
};

const fadeAnimation = {
  initial: { opacity: 0, transition: { duration: 0.8 } },
  animate: { opacity: 1 },
};

export default function Home() {
  const [count, setCount] = useState(1);

  const interval = useRef<NodeJS.Timeout>();
  useEffect(() => {
    interval.current = setInterval(() => {
      setCount(prevCount => {
        if (prevCount < 5) {
          return prevCount + 1;
        } else {
          clearInterval(interval.current);
          return prevCount;
        }
      });
    }, 1000);

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
