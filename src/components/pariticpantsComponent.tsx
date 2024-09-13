"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { Participant } from "@/models/game";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/hooks/redux";
import { getAlbumImageUrl } from "@/lib/utils/albumsPictures";

const MAX_PARTICIPANTS_UI = 4;
const LEFT_MARGIN = 50;
const PARTICIPANT_SIZE = 60;
const IMAGE_PADDING = 4;

const MaxParticipants = ({ count }: { count: number }) => (
  <div
    className="gradient-purple flex justify-center items-center rounded-[12px]"
    style={{ width: PARTICIPANT_SIZE, height: PARTICIPANT_SIZE }}
  >
    <span
      className="w-[56px] h-[56px] rounded-[12px] border-2 border-background text-[16px] text-background flex justify-center items-center"
      style={{
        width: PARTICIPANT_SIZE - IMAGE_PADDING,
        height: PARTICIPANT_SIZE - IMAGE_PADDING,
      }}
    >
      +{count}
    </span>
  </div>
);

const ParticipantComponent = ({
  participant,
}: {
  participant: Participant;
}) => (
  <div
    className="gradient-purple flex justify-center items-center rounded-[12px]"
    style={{ width: PARTICIPANT_SIZE, height: PARTICIPANT_SIZE }}
  >
    <Image
      src={
        participant.albumSelected
          ? getAlbumImageUrl(participant.albumSelected)
          : "/swiftie.png"
      }
      alt={participant.name}
      width={PARTICIPANT_SIZE - IMAGE_PADDING}
      height={PARTICIPANT_SIZE - IMAGE_PADDING}
      className="rounded-[12px] border-2 border-background"
    />
  </div>
);

export default function ParticipantsComponent({
  className,
}: {
  className?: string;
}) {
  const { participants } = useAppSelector(state => state.game);

  const width = useMemo(() => {
    const participantsCount = Math.min(
      participants?.length,
      MAX_PARTICIPANTS_UI + 1,
    );
    const width = PARTICIPANT_SIZE * (participantsCount || 0);
    const padding = (PARTICIPANT_SIZE - LEFT_MARGIN) * (participantsCount - 1);
    return width - padding;
  }, [participants]);

  const sortedParticipants = useMemo(() => {
    if (!participants) return [];
    return [...participants].sort((a, b) => a.joinedAt - b.joinedAt);
  }, [participants]);

  return (
    participants?.length > 0 && (
      <div
        className={cn(
          "w-full h-fit flex flex-col gap-8 justify-center items-center",
          className,
        )}
      >
        <span className="text-[32px] leading-[40px] text-foreground">
          Waiting for all <br /> Swifties to join
        </span>
        <ul
          className="flex flex-row gap-2 justify-center items-center relative"
          style={{ width, height: PARTICIPANT_SIZE }}
        >
          {sortedParticipants.map(
            (participant, index) =>
              index < MAX_PARTICIPANTS_UI + 1 && (
                <li
                  key={participant.name}
                  className={`absolute top-0 z-[${index}]`}
                  style={{
                    left: `${index * LEFT_MARGIN}px`,
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
