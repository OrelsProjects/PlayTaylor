"use client";

import { useEffect, useState } from "react";
import useRoom from "../../../../lib/hooks/useRoom";
import { useAppDispatch, useAppSelector } from "../../../../lib/hooks/redux";
import { setRoom } from "../../../../lib/features/room/roomSlice";
import Room, { Participant } from "../../../../models/room";
import { useRouter } from "next/navigation";
import { cn } from "../../../../lib/utils";
import { montserratAlternates } from "../../../../lib/utils/fontUtils";
import Image from "next/image";

const MAX_PARTICIPANTS_UI = 4;

export default function Waiting({ params }: { params: { code?: string } }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { room } = useAppSelector(state => state.room);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { listenToRoomChanges } = useRoom();

  useEffect(() => {
    if (!room) {
      return;
    }
    const unsubscribe = listenToRoomChanges(room.code, (newRoom: Room) => {
      if (newRoom.gameStartedAt) {
        dispatch(setRoom(newRoom));
        router.push("/lobby" + room.code);
      } else {
        // setParticipants(newRoom.participants || []);
        setParticipants(
          newRoom.participants
            .concat(newRoom.participants)
            .concat(newRoom.participants)
            .concat(newRoom.participants) || [],
        );
      }
    });
    return () => unsubscribe();
  }, [room]);

  const Participant = ({ participant }: { participant: Participant }) => (
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

  const MaxParticipants = ({ count }: { count: number }) => (
    <div className="h-[60px] w-[60px] gradient-purple flex justify-center items-center rounded-[12px]">
      <span className="w-[56px] h-[56px] rounded-[12px] border-2 border-background text-[16px] text-background flex justify-center items-center">
        +{count}
      </span>
    </div>
  );

  return (
    <div
      className={cn(
        "h-full w-full flex flex-col items-center justify-start gap-16 px-14 py-10",
        montserratAlternates.className,
      )}
    >
      {participants.length > 0 && (
        <div className="w-full h-full flex flex-col gap-8 justify-center items-center">
          <span className="text-[32px] leading-[40px] text-foreground">
            Waiting for all <br /> Swifties to join
          </span>
          <ul className="w-full h-full flex flex-row gap-2 justify-center items-center relative">
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
                      <Participant participant={participant} />
                    )}
                  </li>
                ),
            )}
          </ul>
        </div>
      )}
      <div>Waiting room</div>
    </div>
  );
}
