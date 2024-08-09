"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useRoom from "@/lib/hooks/useRoom";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { db } from "@/../firebase.config";
import { onSnapshot, doc } from "firebase/firestore";
import { montserratAlternates } from "@/lib/utils/fontUtils";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import RoomNameComponent from "../../../../../../../components/roomName";

type Stage = "name" | "participants" | "difficulty" | "question";

const writeRoomNameToLocal = (name: string) => {
  localStorage.setItem("roomName", name);
};

const readRoomNameFromLocal = () => {
  return localStorage.getItem("roomName");
};

const writeParticipantsToLocal = (participants: number) => {
  localStorage.setItem("participants", JSON.stringify(participants));
};

const readParticipantsFromLocal = () => {
  const participants = localStorage.getItem("participants");
  if (participants) {
    const count = parseInt(JSON.parse(participants));
    return isNaN(count) ? 0 : count;
  }
};

const writeDifficultyToLocal = (difficulty: string) => {
  localStorage.setItem("difficulty", difficulty);
};

const readDifficultyFromLocal = () => {
  return localStorage.getItem("difficulty");
};

const Stage = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="w-full flex flex-col gap-4"
    >
      <span
        className={cn(
          "text-[40px] leading-10 text-center",
          montserratAlternates.className,
        )}
      >
        {title}
      </span>
      {subtitle && <p className="text-center">{subtitle}</p>}
      {children}
    </motion.div>
  );
};

export default function RoomPage({ params }: { params: { stage: string } }) {
  const router = useRouter();
  const pathname = usePathname();
  const [stage, setStage] = useState<Stage>("name");
  const [name, setName] = useState("");
  const [participants, setParticipants] = useState<number>(0);

  useEffect(() => {
    const name = readRoomNameFromLocal();
    if (name) {
      setName(name);
    }
    const participants = readParticipantsFromLocal();
    if (participants) {
      setParticipants(participants);
    }
    const difficulty = readDifficultyFromLocal();
    if (difficulty) {
      setStage("question");
    }
  }, []);

  useEffect(() => {
    const stage = params.stage?.[0] as Stage;
    if (stage) {
      setStage(stage);
    } else {
      router.push(`/admin/room/create`);
    }
  }, [pathname]);

  const nextStage = () => {
    let newStage = stage;
    if (stage === "name") {
      newStage = "participants";
    } else if (stage === "participants") {
      newStage = "difficulty";
    } else if (stage === "difficulty") {
      newStage = "question";
    }
    router.push(`/admin/room/create/${newStage}`);
  };

  const prevStage = () => {
    if (stage === "participants") {
      setStage("name");
    } else if (stage === "difficulty") {
      setStage("participants");
    } else if (stage === "question") {
      setStage("difficulty");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setName(name);
    writeRoomNameToLocal(name);
  };

  const handleParticipantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const clampedValue = Math.min(10, Math.max(2, value));
    setParticipants(clampedValue);
    writeParticipantsToLocal(clampedValue);
  };

  return (
    <div className="h-full w-full flex flex-col gap-4 items-center justify-center px-[55px]">
      {name && stage !== "name" && (
        <div className="absolute top-10 mx-auto">
          <RoomNameComponent name={name} />
        </div>
      )}
      {stage === "name" ? (
        <Stage
          title="Department's name"
          // subtitle="Please enter your name to create a room"
          key="name"
        >
          <Input
            value={name}
            onChange={e => handleNameChange(e)}
            placeholder="Eras tour 2024"
            className="bg-white !py-6"
          />
          <Button
            onClick={() => {
              if (!name) {
                toast.error("Please enter a name");
                return;
              }
              nextStage();
            }}
          >
            Next
          </Button>
        </Stage>
      ) : stage === "participants" ? (
        <Stage
          title="Participants"
          subtitle="The number of Swifties who will participate"
          key="participants"
        >
          <Input
            value={participants}
            onChange={e => handleParticipantChange(e)}
            placeholder="Between 2-10"
            type="number"
            className="bg-white !py-6"
            max={10}
            min={2}
          />
          <Button
            onClick={() => {
              if (participants < 2 || participants > 10) {
                toast.error("Please enter a number between 2-10");
                return;
              }
              nextStage();
            }}
          >
            Next
          </Button>
        </Stage>
      ) : stage === "difficulty" ? (
        <Stage title="Difficulty level" key="difficulty">
          <Button onClick={() => setStage("question")}>Next</Button>
        </Stage>
      ) : (
        <Stage
          title="Questions"
          subtitle="How many questions in the game"
          key="question"
        >
          <Button
            onClick={() => {
              toast.success("Orel: Implement pin page");
            }}
          >
            Next
          </Button>
        </Stage>
      )}
    </div>
  );
}
