"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import useRoom from "../lib/hooks/useRoom";
import Room, { Participant } from "../models/room";
import { cn } from "../lib/utils";

const MAX_PARTICIPANTS_UI = 4;

const MaxParticipants = ({ count }: { count: number }) => (
  <div className="h-[60px] w-[60px] gradient-purple flex justify-center items-center rounded-[12px]">
    <span className="w-[56px] h-[56px] rounded-[12px] border-2 border-background text-[16px] text-background flex justify-center items-center">
      +{count}
    </span>
  </div>
);

const ParticipantComponent = ({
  participant,
}: {
  participant: Participant;
}) => (
  <div className="h-[60px] w-[60px] gradient-purple flex justify-center items-center rounded-[12px]">
    <Image
      src={"/swiftie.png"}
      alt={participant.name}
      width={58}
      height={58}
      className="rounded-[12px] border border-background"
    />
  </div>
);

export default function ParticipantsComponent({
  code,
  className,
  onCountdownStarted,
}: {
  code: string;
  className?: string;
  onCountdownStarted: (room: Room) => void;
}) {
  const [participants, setParticipants] = useState<Participant[]>([]);

  const { listenToRoomChanges } = useRoom();

  useEffect(() => {
    const unsubscribe = listenToRoomChanges(code, (newRoom: Room) => {
      if (newRoom) {
        if (newRoom.countdownStartedAt) {
          onCountdownStarted(newRoom);
        }
        setParticipants(newRoom.participants);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [code]);

  return (
    participants.length > 0 && (
      <div
        className={cn(
          "w-full h-full flex flex-col gap-8 justify-center items-center",
          className,
        )}
      >
        <span className="text-[32px] leading-[40px] text-foreground">
          Waiting for all <br /> Swifties to join
        </span>
        <ul className="w-full h-[60px] flex flex-row gap-2 justify-center items-center relative">
          {participants.map(
            (participant, index) =>
              index < MAX_PARTICIPANTS_UI + 1 && (
                <li
                  key={participant.name}
                  className={`absolute top-0 z-[${index}]`}
                  style={{
                    left: `${index * 50}px`,
                  }}
                >
                  {index === MAX_PARTICIPANTS_UI ? (
                    <MaxParticipants
                      count={participants.length - MAX_PARTICIPANTS_UI}
                    />
                  ) : (
                    <ParticipantComponent participant={participant} />
                  )}
                </li>
              ),
          )}
        </ul>
      </div>
    )
  );
}
