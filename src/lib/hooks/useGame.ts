"use client";

import { Logger } from "@/logger";
import {
  Difficulty,
  QuestionOption,
  QuestionResponse,
} from "@/models/question";
import { useAppDispatch, useAppSelector } from "./redux";
import axios from "axios";
import {
  addQuestionResponse,
  updateParticipant,
} from "../features/room/roomSlice";
import { buildLocalSotrageKey, Stage } from "./_utils";
import Room from "../../models/room";
import {
  setGameDifficulty,
  setGameName,
  setParticipantsCount,
  setQuestionsCount,
} from "../features/game/gameSlice";

const writeRoomNameToLocal = (name: string) => {
  localStorage.setItem(buildLocalSotrageKey("room_name"), name);
};

const readRoomNameFromLocal = () => {
  return localStorage.getItem(buildLocalSotrageKey("room_name"));
};

const writeParticipantsToLocal = (participants: number) => {
  localStorage.setItem(
    buildLocalSotrageKey("participants"),
    JSON.stringify(participants),
  );
};

const readParticipantsFromLocal = () => {
  const participants = localStorage.getItem(
    buildLocalSotrageKey("participants"),
  );
  if (participants) {
    const count = parseInt(JSON.parse(participants));
    return isNaN(count) ? 0 : count;
  }
};

const writeDifficultyToLocal = (difficulty: string) => {
  localStorage.setItem(buildLocalSotrageKey("difficulty"), difficulty);
};

const readDifficultyFromLocal = () => {
  return localStorage.getItem(buildLocalSotrageKey("difficulty"));
};

const writeQuestionsCountToLocal = (count: number) => {
  localStorage.setItem(
    buildLocalSotrageKey("questions_count"),
    JSON.stringify(count),
  );
};

const readQuestionsCountFromLocal = () => {
  const count = localStorage.getItem(buildLocalSotrageKey("questions_count"));
  if (count) {
    return parseInt(JSON.parse(count));
  }
};

const writeLastStageToLocal = (stage: Stage) => {
  localStorage.setItem(buildLocalSotrageKey("last_stage"), stage);
};

const readLastStageFromLocal = () => {
  return localStorage.getItem(buildLocalSotrageKey("last_stage")) as Stage;
};

const deleteLastStageFromLocal = () => {
  localStorage.removeItem(buildLocalSotrageKey("last_stage"));
};

export default function useGame() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { room, userParticipant } = useAppSelector(state => state.room);

  const initGameFromLocal = (): {
    name: string | null;
    participants?: number | null;
    difficulty?: Difficulty | null;
    questionsCount?: number | null;
  } => {
    const name = readRoomNameFromLocal();
    if (name) {
      dispatch(setGameName(name));
    }
    const participants = readParticipantsFromLocal();
    if (participants) {
      dispatch(setParticipantsCount(participants));
    }
    const difficulty = readDifficultyFromLocal();
    if (difficulty) {
      dispatch(setGameDifficulty(difficulty as Difficulty));
    }

    const questionsCount = readQuestionsCountFromLocal();
    if (questionsCount) {
      dispatch(setQuestionsCount(questionsCount));
    }
    return {
      name,
      participants,
      difficulty: difficulty as Difficulty,
      questionsCount,
    };
  };

  const clearLocalGame = () => {
    localStorage.removeItem(buildLocalSotrageKey("room_name"));
    localStorage.removeItem(buildLocalSotrageKey("participants"));
    localStorage.removeItem(buildLocalSotrageKey("difficulty"));
    localStorage.removeItem(buildLocalSotrageKey("questions_count"));
  };

  const writeStageToLocal = (stage: Stage) => {
    localStorage.setItem(buildLocalSotrageKey("stage"), stage);
  };

  const updateGameName = (name: string) => {
    dispatch(setGameName(name));
    writeRoomNameToLocal(name);
  };

  const updateParticipants = (participants: number) => {
    dispatch(setParticipantsCount(participants));
    writeParticipantsToLocal(participants);
  };

  const updateDifficulty = (difficulty: Difficulty) => {
    dispatch(setGameDifficulty(difficulty));
    writeDifficultyToLocal(difficulty);
  };

  const updateQuestionsCount = (count: number) => {
    dispatch(setQuestionsCount(count));
    writeQuestionsCountToLocal(count);
  };

  const answerQuestion = async (
    response: QuestionOption,
    questionId: string,
  ) => {
    if (!room) {
      Logger.error("Room not found");
      throw new Error("Room not found");
    }

    if (!userParticipant) {
      Logger.error("User participant not found");
      throw new Error("User participant not found");
    }
    const participantName = userParticipant.name;
    const participantIndex = room?.participants.findIndex(
      p => p.name === participantName,
    );
    if (participantIndex === -1) {
      Logger.error("Participant not found");
      throw new Error("Participant not found");
    }
    let previousParticipant = room.participants[participantIndex];
    if (
      previousParticipant.questionResponses?.find(
        q => q.response.questionId === questionId,
      )
    ) {
      // Participant already answered this question
      return;
    }
    try {
      debugger;
      // Optimistic update
      const questionResponse: {
        participantName: string;
        response: QuestionResponse;
      } = {
        participantName,
        response: {
          questionId,
          response,
          userId: user?.userId,
          answeredAt: new Date(),
        },
      };
      dispatch(addQuestionResponse(questionResponse));
      await axios.post(`/api/game/${room.code}/question/${questionId}/answer`, {
        response,
        participantName,
      });
    } catch (error: any) {
      Logger.error(error);
      // Rollback
      if (previousParticipant) {
        const participantIndex = room?.participants.findIndex(
          p => p.name === participantName,
        );
        if (participantIndex !== -1) {
          room.participants[participantIndex] = previousParticipant;
        }
        dispatch(updateParticipant(previousParticipant));
      }
      throw error;
    }
  };

  return {
    answerQuestion,
    clearLocalGame,
    initGameFromLocal,
    updateGameName,
    updateParticipants,
    updateDifficulty,
    updateQuestionsCount,
    writeStageToLocal,
  };
}
