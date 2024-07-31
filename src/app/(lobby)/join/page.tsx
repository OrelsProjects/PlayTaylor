"use client";

import { useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import useRoom from "../../../lib/hooks/useRoom";
import { useAppDispatch, useAppSelector } from "../../../lib/hooks/redux";
import {
  setRoom,
  setUserParticipant,
} from "../../../lib/features/room/roomSlice";
import Room from "../../../models/room";
import { useRouter } from "next/navigation";
import RoomNameComponent from "../../../components/roomName";

type Stage = "pin" | "name";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { getRoom, joinRoom } = useRoom();
  const { room } = useAppSelector(state => state.room);

  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<Stage>("pin");

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (stage === "pin") {
        const room: Room = await getRoom(pin);
        if (room) {
          dispatch(setRoom(room));
          setStage("name");
        }
      } else {
        const participant = await joinRoom(pin, name);
        if (participant) {
          dispatch(setUserParticipant(participant));
          if (room?.gameStartedAt) {
            router.push("/lobby");
          } else {
            router.push("/waiting");
          }
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-start gap-16 px-14 py-10">
      <div className="h-full w-full flex flex-col gap-[52px] justify-center items-center">
        <p className="text-[40px] leading-10">
          {stage === "pin" ? "Insert pin" : "Insert name"}
        </p>
        <div className="flex flex-col gap-4">
          {stage === "pin" && (
            <Input
              type="text"
              placeholder={"Pin"}
              value={pin}
              maxLength={6}
              onChange={e => {
                if (stage === "pin") {
                  setPin(e.target.value);
                }
              }}
            />
          )}
          {stage === "name" && (
            <Input
              type="text"
              placeholder={"Swiftie Doe"}
              value={name}
              maxLength={20}
              onChange={e => {
                setName(e.target.value);
              }}
            />
          )}
          <Button onClick={handleSubmit} isLoading={loading}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
