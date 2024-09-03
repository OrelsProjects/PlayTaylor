"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { montserratAlternates } from "@/lib/utils/fontUtils";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { Difficulty } from "@/models/question";
import DifficultyComponent from "./difficultyComponent";
import useRoom from "@/lib/hooks/useRoom";
import { Logger } from "@/logger";
import { Stage } from "@/lib/hooks/_utils";
import useGame from "@/lib/hooks/useGame";

const StageComponent = ({
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
      initial={{ x: 100, opacity: 0 }}
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
  const { createRoom } = useRoom();
  const {
    initGameFromLocal,
    updateDifficulty,
    updateGameName,
    writeStageToLocal,
    updateParticipants,
    updateQuestionsCount,
    clearLocalGame,
  } = useGame();
  const [stage, setStage] = useState<Stage>("name");
  const [name, setName] = useState("");
  const [participants, setParticipants] = useState<number>(2);
  const [difficulty, setDifficulty] = useState<Difficulty>("debut");
  const [questionsCount, setQuestionsCount] = useState<number | undefined>();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const { name, participants, difficulty, questionsCount } =
      initGameFromLocal();
    setName(name || "");
    setParticipants(participants || 2);
    setDifficulty(difficulty || "debut");
    setQuestionsCount(questionsCount || undefined);
  }, []);

  useEffect(() => {
    const paramsStage = params.stage?.[0] as Stage;
    // const lastStage = readLastStageFromLocal();
    // if (lastStage && paramsStage && lastStage !== paramsStage) {
    //   setStage(lastStage);
    //   router.push(`/admin/room/create/${lastStage}`);
    //   deleteLastStageFromLocal();
    //   return;
    // }
    if (paramsStage) {
      setStage(paramsStage);
    } else {
      router.push(`/admin/room/create`);
    }
  }, [pathname]);

  const handleCreateRoom = async () => {
    if (!questionsCount || !name || !participants || !difficulty) {
      toast.error("Please fill all the fields");
      return;
    }
    if (isCreating) return;
    setIsCreating(true);
    const toastId = toast.loading("Creating room...");
    try {
      const code = await createRoom({
        name,
        participantsCount: participants,
        difficulty,
        questionsCount: questionsCount!,
      });
      router.push("/admin/room/" + code);
      clearLocalGame();
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
    if (stage === "name") {
      newStage = "participants";
    } else if (stage === "participants") {
      newStage = "difficulty";
    } else if (stage === "difficulty") {
      newStage = "question";
    } else if (stage === "question") {
      await handleCreateRoom();
      return;
    }
    router.push(`/admin/room/create/${newStage}`);
    writeStageToLocal(newStage);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setName(name);
  };

  const handleParticipantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const clampedValue = Math.min(10, Math.max(2, value));
    setParticipants(clampedValue);
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setDifficulty(difficulty);
  };

  const handleQuestionsCountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(e.target.value);
    const clampedValue = Math.min(100, Math.max(1, value));
    setQuestionsCount(clampedValue);
  };

  const handleNewNameSet = () => {
    if (!name) {
      toast.error("Please enter a name");
      return;
    }
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

  return (
    <div className="h-full w-full flex flex-col gap-4 items-center justify-center">
      {stage === "name" ? (
        <StageComponent title="Department's name" key="name">
          <Input
            value={name}
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
            onChange={e => handleParticipantChange(e)}
            placeholder="Between 2-10"
            type="number"
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
      ) : (
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
            Create room
          </Button>
        </StageComponent>
      )}
    </div>
  );
}
