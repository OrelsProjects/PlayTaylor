"use client";
import { motion, useAnimation } from "framer-motion";
import React, { useEffect, useState } from "react";

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
}: {
  children: React.ReactNode;
}) {
  const [currentGradient, setCurrentGradient] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const cycleGradients = async () => {
      while (true) {
        await controls.start({
          background: `linear-gradient(to bottom right, ${gradients[currentGradient][0]}, ${gradients[currentGradient][1]}, ${gradients[currentGradient][2]}, ${gradients[currentGradient][3]})`,
          transition: { duration: 3 },
        });
        setCurrentGradient(prev => (prev + 1) % gradients.length);
      }
    };
    cycleGradients();
  }, [controls, currentGradient]);

  return (
    <motion.div
      className="w-full h-svh flex flex-col bg-[hsla(277, 100%, 99%, 1)]"
      animate={controls}
    >
      {children}
    </motion.div>
  );
}
