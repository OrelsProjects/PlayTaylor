"use client";

import { useEffect, useState } from "react";
import useRoom from "../../lib/hooks/useRoom";
import { useAppDispatch, useAppSelector } from "../../lib/hooks/redux";
import { setRoom } from "../../lib/features/room/roomSlice";
import Room, { Participant } from "../../models/room";
import { useRouter } from "next/navigation";

type Stage = "pin" | "name";

export default function Home() {
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
        router.push("/lobby");
      } else {
        setParticipants(newRoom.participants || []);
      }
    });
    return () => unsubscribe();
  }, [room]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-start gap-16 px-14 py-10">
      <h3 className="font-stalemate text-5xl text-foreground font-light">
        {room?.name || "Eras Tour 2024"}
      </h3>
      {participants.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl text-foreground">Participants</h3>
          <ul className="flex flex-col gap-2">
            {participants.map(participant => (
              <li key={participant.name}>{participant.name}</li>
            ))}
          </ul>
        </div>
      )}
      <div>Waiting room</div>
    </div>
  );
}
