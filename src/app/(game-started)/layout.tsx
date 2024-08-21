"use client";

import React, { useEffect, useMemo, useState } from "react";
import RoomNameComponent from "../../components/roomName";
import { cn } from "../../lib/utils";
import { montserratAlternates } from "../../lib/utils/fontUtils";
import { useAppSelector } from "../../lib/hooks/redux";
import { PauseButton } from "./pauseButton";

export default function LobbyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { room } = useAppSelector(state => state.room);

  return (
    <div className="w-full h-svh flex flex-col">
      <div
        className={cn(
          "w-full flex flex-col items-center justify-start px-14 py-6 border-[1px] border-b-foreground/15",
          montserratAlternates.className,
        )}
      >
        <RoomNameComponent name={room?.name || ""} type="compact" />
      </div>
      <div className="h-fit w-full flex justify-center items-center overflow-auto mt-6 mb-2">
        {children}
      </div>
      <div className="w-full h-fit flex justify-center items-center py-2">
        <PauseButton />
      </div>
    </div>
  );
}
