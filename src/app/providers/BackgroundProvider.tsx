"use client";
import { motion, useAnimation } from "framer-motion";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { cn } from "../../lib/utils";

const gradients = [
  [
    "hsla(288, 78%, 93%, 1)",
    "hsla(251, 100%, 96%, 1)",
    "hsla(276, 100%, 99%, 1)",
    "hsla(288, 78%, 93%, 1)",
  ],
  [
    "hsla(251, 100%, 96%, 1)",
    "hsla(276, 100%, 99%, 1)",
    "hsla(288, 78%, 93%, 1)",
    "hsla(288, 78%, 93%, 1)",
  ],
  [
    "hsla(276, 100%, 99%, 1)",
    "hsla(288, 78%, 93%, 1)",
    "hsla(288, 78%, 93%, 1)",
    "hsla(251, 100%, 96%, 1)",
  ],
  [
    "hsla(288, 78%, 93%, 1)",
    "hsla(288, 78%, 93%, 1)",
    "hsla(251, 100%, 96%, 1)",
    "hsla(276, 100%, 99%, 1)",
  ],
];
export default function BackgroundProvider({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [currentGradient, setCurrentGradient] = useState(0);
  const controls = useAnimation();

  // We want the user to see the background before the page is loaded
  useEffect(() => {
    const cycleGradients = async () => {
      // while (true) {
      //   try {
      //     await controls.start({
      //       background: `linear-gradient(to bottom right, ${gradients[currentGradient][0]}, ${gradients[currentGradient][1]}, ${gradients[currentGradient][2]}, ${gradients[currentGradient][3]})`,
      //       transition: { duration: 3 },
      //     });
      //     setCurrentGradient(prev => (prev + 1) % gradients.length);
      //   } catch (e) {
      //     break;
      //     //  controls.start() should only be called after a component has mounted. Consider calling within a useEffect hook.
      //   }
      // }
    };
    cycleGradients();
  }, [controls, currentGradient]);

  return (
    <motion.div
      className={cn("bg-[hsla(277, 100%, 99%, 1)]", className)}
      animate={controls}
    >
      {children}
    </motion.div>
  );
}
