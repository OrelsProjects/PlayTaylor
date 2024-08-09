"use client";

import React, { useEffect, useState } from "react";
import RoomNameComponent from "../../components/roomName";
import { cn } from "../../lib/utils";
import { montserratAlternates } from "../../lib/utils/fontUtils";
import { useAppSelector } from "../../lib/hooks/redux";

export default function LobbyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { params: { code?: string } };
}) {
  const { room } = useAppSelector(state => state.room);

  return (
    <div className="w-full h-svh flex flex-col">
      <div
        className={cn(
          "w-full flex flex-col items-center justify-start gap-16 px-14 py-10",
          montserratAlternates.className,
        )}
      >
        <RoomNameComponent name={room?.name || ""} />
      </div>
      <div className="h-full w-full flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}
