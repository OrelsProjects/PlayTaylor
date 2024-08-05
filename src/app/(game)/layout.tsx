"use client";

import React, { useEffect, useState } from "react";
import RoomNameComponent from "../../components/roomName";
import { cn } from "../../lib/utils";
import { montserratAlternates } from "../../lib/utils/fontUtils";
import { useAppSelector } from "../../lib/hooks/redux";
import { motion, useAnimation } from "framer-motion";

export default function LobbyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const { room } = useAppSelector(state => state.room);

  return (
    <motion.div
      className="w-full h-svh flex flex-col bg-[hsla(277, 100%, 99%, 1)]"
      animate={controls}
    >
      <div
        className={cn(
          "w-full flex flex-col items-center justify-start gap-16 px-14 py-10",
          montserratAlternates.className,
        )}
      >
        <RoomNameComponent name={room?.name || ""} />
      </div>
      <div className="h-full w-full flex justify-center items-center px-4">
        {children}
      </div>
    </motion.div>
  );
}
