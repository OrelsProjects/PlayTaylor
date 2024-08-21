"use client";
import React from "react";
import { useAppDispatch } from "../../../../lib/hooks/redux";
import { setRoom } from "../../../../lib/features/room/roomSlice";
import Room from "../../../../models/room";
import { useRouter } from "next/navigation";
import { cn } from "../../../../lib/utils";
import { montserratAlternates } from "../../../../lib/utils/fontUtils";
import ParticipantsComponent from "../../../../components/pariticpantsComponent";

export default function Waiting({ params }: { params: { code?: string } }) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <div
      className={cn(
        "h-full w-full flex flex-col items-center justify-start gap-16 px-14 py-10",
        montserratAlternates.className,
      )}
    >
      <div className="w-full h-full flex flex-col gap-8 justify-center items-center">
        <ul className="w-full h-full flex flex-row gap-2 justify-center items-center relative">
          {params.code && (
            <ParticipantsComponent
              code={params.code}
              onCountdownStarted={(newRoom: Room) => {
                dispatch(setRoom(newRoom));
                router.push("/lobby/" + newRoom.code);
              }}
            />
          )}
        </ul>
      </div>
      <div>Waiting room</div>
    </div>
  );
}
