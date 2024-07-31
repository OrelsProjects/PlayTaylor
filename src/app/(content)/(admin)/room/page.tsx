"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import useRoom from "../../../../lib/hooks/useRoom";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import { cn } from "../../../../lib/utils";
import { db } from "@/../firebase.config";
import { onSnapshot, doc } from "firebase/firestore";

const JoinRoomDialog = ({
  open,
  codeValue,
  nameValue,
  onCodeChange,
  onNameChange,
  opOpenChange,
  onJoinRoom,
}: {
  open: boolean;
  codeValue: string;
  nameValue: string;
  onCodeChange: (code: string) => void;
  onNameChange: (name: string) => void;
  opOpenChange: (isOpen: boolean) => void;
  onJoinRoom: () => void;
}) => {
  const handleJoinRoom = () => {
    if (nameValue && codeValue) {
      onJoinRoom();
    } else {
      toast.error("Please enter name and code");
    }
  };

  return (
    <Dialog open={open} onOpenChange={opOpenChange}>
      <DialogTrigger>
        <Button
          variant="secondary"
          onClick={() => {
            opOpenChange(true);
          }}
          className="w-44"
        >
          Join Room
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-4">
        <DialogHeader>Join Room</DialogHeader>
        <Input
          value={codeValue}
          onChange={e => onCodeChange(e.target.value)}
          placeholder="Enter room code"
        />
        <Input
          value={nameValue}
          onChange={e => onNameChange(e.target.value)}
          placeholder="Enter your name"
        />
        <DialogFooter>
          <Button onClick={handleJoinRoom}>Join</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function RoomPage() {
  const { createRoom, getRoom, joinRoom, leaveRoom, startGame } = useRoom();
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [room, setRoom] = useState<any>(null);
  const [participants, setParticipants] = useState<any>([]);

  useEffect(() => {
    let unsubscribe = () => {};

    if (db && code) {
      const roomRef = doc(db, "rooms", code);
      unsubscribe = onSnapshot(
        roomRef,
        snapshot => {
          const updatedParticipants = snapshot.data()?.participants || [];
          setParticipants(updatedParticipants);
        },
        error => {
          // Handle errors, such as permissions issues
          console.error("Failed to subscribe to participants updates:", error);
        },
      );
    }

    return () => {
      unsubscribe(); // Clean up the subscription
    };
  }, [code]);

  const handleCreateRoom = async () => {
    const toastId = toast.loading("Creating room...");
    try {
      const name = "Orel";
      const roomCode = await createRoom(name);
      setCode(roomCode);
      setRoom(null);
      toast.success("Room created!");
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Unauthorized. Did you login?");
        return;
      }
      toast.error("Error creating room");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleJoinRoom = async () => {
    const loadingToastId = toast.loading("Joining room...");
    try {
      const room = await joinRoom(code, name);
      setRoom(room);
      setShowJoinRoom(false);
    } catch (error) {
      toast.error("Error joining room");
    } finally {
      toast.dismiss(loadingToastId);
    }
  };

  const handleGetRoom = async () => {
    const room = await getRoom(code);
    setRoom(room);
  };

  const handleStartGame = async () => {
    const toastId = toast.loading("Starting game...");
    try {
      await startGame(code);
    } catch (error) {
      toast.error("Error starting game");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleLeaveRoom = async () => {
    const toastId = toast.loading("Leaving room...");
    try {
      await leaveRoom(code, name);
      setRoom(null);
    } catch (error) {
      toast.error("Error leaving room");
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="h-full w-full flex flex-col gap-4 items-center">
      <h1
        className={cn("text-2xl transition-colors hover:cursor-pointer", {
          "text-green-500": room,
        })}
        onClick={() => {
          // copy to clipboard and show toast
          navigator.clipboard.writeText(code);
          toast.success("Room code copied to clipboard");
        }}
      >
        {code}
      </h1>
      <div className="flex flex-col gap-2">
        {participants.map((participant: any) => (
          <div key={participant.name} className="flex gap-2">
            <span>{participant.name}</span>
            <span>{participant.correctAnswers}</span>
          </div>
        ))}
      </div>
      <Button onClick={handleCreateRoom} className="w-44">
        Create Room
      </Button>

      <JoinRoomDialog
        open={showJoinRoom}
        codeValue={code}
        nameValue={name}
        onCodeChange={setCode}
        onNameChange={setName}
        opOpenChange={setShowJoinRoom}
        onJoinRoom={handleJoinRoom}
      />
      <Button onClick={handleStartGame} className="w-44">
        Start Game
      </Button>
      <Button variant="destructive" onClick={handleLeaveRoom} className="w-44">
        Leave room
      </Button>
      <Button variant="ghost" onClick={handleGetRoom} className="w-44">
        Get Room
      </Button>
    </div>
  );
}
