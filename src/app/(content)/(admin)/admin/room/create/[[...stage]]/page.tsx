"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "@/lib/hooks/redux";
import { cn } from "@/lib/utils";
import { montserratAlternates } from "@/lib/utils/fontUtils";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Difficulty } from "@/models/question";
import useRoom from "@/lib/hooks/useRoom";
import { Logger } from "@/logger";
import { Stage } from "@/lib/hooks/_utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DifficultyComponent from "./difficultyComponent";
import { useCustomRouter } from "@/lib/hooks/useCustomRouter";
import { FiEdit as Edit } from "react-icons/fi";

const StageComponent = ({
  title,
  subtitle,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className={cn("w-full flex flex-col gap-4", className)}
    >
      {title && (
        <span
          className={cn(
            "text-[40px] leading-10 text-center",
            montserratAlternates.className,
          )}
        >
          {title}
        </span>
      )}
      {subtitle && <p className="text-center">{subtitle}</p>}
      {children}
    </motion.div>
  );
};

const EditBox = ({
  onEdit,
  title,
  value,
}: {
  onEdit: () => void;
  title: string;
  value: string;
}) => (
  <div className="h-fitw-full p-7 flex flex-row justify-between items-start rounded-lg bg-background">
    <div className="h-full flex flex-col items-start justify-center gap-2">
      <p className="leading-3 text-xl">{title}</p>
      <p className="text-primary-gradient font-bold text-xl">{value}</p>
    </div>
    <Button
      className="h-5 w-5 p-4 gradient-purple rounded-bl-none"
      onClick={onEdit}
    >
      <Edit />
    </Button>
  </div>
);

export default function RoomPage({ params }: { params: { stage: string } }) {
  const router = useCustomRouter();
  const pathname = usePathname();
  const { room, wasInConfirm } = useAppSelector(state => state.room);
  const {
    updateDifficulty,
    updateGameName,
    updateParticipants,
    updateWasInConfirm,
    updateQuestionsCount,
    createRoom,
  } = useRoom();
  const [stage, setStage] = useState<Stage>("name");
  const [name, setName] = useState<string | undefined>(room.name);
  const [participants, setParticipants] = useState<number>(
    room.participantsCount || 2,
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(
    room.difficulty || "debut",
  );
  const [questionsCount, setQuestionsCount] = useState<number | undefined>(
    room.questionsCount,
  );
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const paramsStage = params.stage?.[0] as Stage;
    if (paramsStage) {
      setStage(paramsStage);
    } else {
      router.push(`/admin/room/create`);
    }
  }, [pathname]);

  const handleCreateRoom = async () => {
    if (
      !room.questionsCount ||
      !room.name ||
      !room.participantsCount ||
      !room.difficulty
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    if (isCreating) return;
    setIsCreating(true);
    const toastId = toast.loading("Creating room...");
    try {
      const code = await createRoom({
        name: room.name,
        participantsCount: room.participantsCount,
        difficulty: room.difficulty,
        questionsCount: room.questionsCount,
      });
      router.push("/admin/room/" + code);
    } catch (error: any) {
      Logger.error(error);
      toast.error("Something went wrong... try again :)");
    } finally {
      setIsCreating(false);
      toast.dismiss(toastId);
    }
  };
  const nextStage = async () => {
    let newStage = stage;

    if (wasInConfirm) {
      newStage = "confirm";
    } else {
      switch (stage) {
        case "name":
          newStage = "participants";
          break;
        case "participants":
          newStage = "difficulty";
          break;
        case "difficulty":
          newStage = "question";
          break;
        case "question":
          newStage = "confirm";
          updateWasInConfirm(true);
          break;
        case "confirm":
          await handleCreateRoom();
          return;
      }
    }
    router.push(`/admin/room/create/${newStage}`);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setName(name);
    updateGameName(name);
  };

  const handleParticipantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const clampedValue = Math.min(10, Math.max(2, value));
    setParticipants(clampedValue);
    updateParticipants(clampedValue);
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setDifficulty(difficulty);
    updateDifficulty(difficulty);
  };

  const handleQuestionsCountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(e.target.value);
    const clampedValue = Math.min(100, Math.max(1, value));
    setQuestionsCount(clampedValue);
    updateQuestionsCount(clampedValue);
  };

  const handleNewNameSet = () => {
    if (!name) {
      toast.error("Please enter a name");
      return;
    }
    setName(name);
    updateGameName(name);
    nextStage();
  };

  const handleParticipantsCountSet = () => {
    if (!participants) {
      toast.error("Please enter a valid number");
      return;
    }
    updateParticipants(participants);
    nextStage();
  };

  const handleDifficultySet = () => {
    updateDifficulty(difficulty);
    nextStage();
  };

  const handleQuestionsCountSet = () => {
    if (!questionsCount) {
      toast.error("Please enter a valid number");
      return;
    }
    updateQuestionsCount(questionsCount);
    nextStage();
  };

  const handleEdit = (stage: Stage) => {
    setStage(stage);
    updateWasInConfirm(true);
    router.push(`/admin/room/create/${stage}`);
  };

  return (
    <div className="h-full w-full flex flex-col gap-4 items-center justify-center">
      {stage === "name" ? (
        <StageComponent title="Department's name" key="name">
          <Input
            value={name}
            defaultValue={room.name}
            autoFocus
            onChange={e => handleNameChange(e)}
            placeholder="Eras tour 2024"
            className="bg-white !py-6"
          />
          <Button type="submit" onClick={handleNewNameSet}>
            Next
          </Button>
        </StageComponent>
      ) : stage === "participants" ? (
        <StageComponent
          title="Participants"
          subtitle="The number of Swifties who will participate"
          key="participants"
        >
          <Input
            value={participants}
            defaultValue={room.participantsCount}
            onChange={e => handleParticipantChange(e)}
            placeholder="Between 2-10"
            type="number"
            autoFocus
            className="bg-white !py-6"
            max={10}
            min={2}
          />
          <Button onClick={handleParticipantsCountSet}>Next</Button>
        </StageComponent>
      ) : stage === "difficulty" ? (
        <StageComponent title="Difficulty level" key="difficulty">
          <DifficultyComponent
            value={difficulty}
            onDifficultyChange={handleDifficultyChange}
          />
          <Button onClick={() => handleDifficultySet()}>Next</Button>
        </StageComponent>
      ) : stage === "question" ? (
        <StageComponent
          title="Questions"
          subtitle="How many questions in the game"
          key="question"
        >
          <Input
            value={questionsCount}
            onChange={e => handleQuestionsCountChange(e)}
            placeholder="Between 1-100"
            type="number"
            autoFocus
            className="bg-white !py-6"
            max={1}
            min={100}
          />
          <Button
            onClick={() => {
              handleQuestionsCountSet();
            }}
            disabled={isCreating}
          >
            Next
          </Button>
        </StageComponent>
      ) : (
        <StageComponent className="h-full w-full flex flex-col gap-6">
          <div className="pb-6 border-b border-foreground/15">
            <p className="font-medium text-accent text-2xl leading-10 text-center px-6">
              Your department details
            </p>
          </div>
          <div className="flex flex-col gap-5 px-6 text-sm">
            <p className="">
              If you&apos;d like to change anything, simply press the box.
              <br /> If all is well, press Move on.
            </p>
            <EditBox
              onEdit={() => handleEdit("name")}
              title="Department's name"
              value={name || ""}
            />
            <EditBox
              onEdit={() => handleEdit("participants")}
              title="Number Of Participants"
              value={`${room.participantsCount}` || ""}
            />
            <EditBox
              onEdit={() => handleEdit("difficulty")}
              title="Difficulty Level"
              value={room.difficulty || ""}
            />
            <EditBox
              onEdit={() => handleEdit("question")}
              title="Number Of Questions"
              value={`${room.questionsCount}` || ""}
            />
            <Button
              className="mt-2 font-semibold text-sm py-[14px]"
              onClick={() => {
                handleCreateRoom();
              }}
              isLoading={isCreating}
            >
              Move on
            </Button>
          </div>
        </StageComponent>
      )}
    </div>
  );
}
