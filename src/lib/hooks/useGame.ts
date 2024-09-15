"use client";
/**
 * @file This file contains the useGame hook which is used to manage the game state.
 * It is used to update the game state, answer questions, and manage the game state in the local storage.
 */

import { useCallback, useRef } from "react";
import axios from "axios";
import { getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { Logger } from "@/logger";
import { QuestionOption } from "@/models/question";
import { useAppDispatch, useAppSelector } from "./redux";
import { buildLocalSotrageKey } from "@/lib/hooks/_utils";
import LoadingError from "@/models/errors/LoadingError";
import {
  Counters,
  Game,
  GameSession,
  isGameRunning,
  Participant,
} from "@/models/game";
import { setRoom } from "@/lib/features/room/roomSlice";
import {
  setGame,
  setParticipants,
  removeQuestionResponse,
  addQuestionResponse,
  setCounters,
} from "@/lib/features/game/gameSlice";
import { NameTakenError } from "@/models/errors/NameTakenError";
import {
  countersDocClient,
  gameDocClient,
  participantsColClient,
} from "@/lib/utils/firestoreClient";
import { NoParticipantsError } from "@/models/errors/NoParticipantsError";

export type Unsubscribe = () => void;

const clearLocalGame = () => {
  localStorage.removeItem(buildLocalSotrageKey("room_name"));
  localStorage.removeItem(buildLocalSotrageKey("participants"));
  localStorage.removeItem(buildLocalSotrageKey("difficulty"));
  localStorage.removeItem(buildLocalSotrageKey("questions_count"));
  localStorage.removeItem(buildLocalSotrageKey("code"));
};

const writeGameJoinedToLocalStorage = (code: string, participant: any) =>
  localStorage.setItem(buildLocalSotrageKey("code"), code);

const getGameJoinedFromLocalStorage = () =>
  localStorage.getItem(buildLocalSotrageKey("code"));

export default function useGame() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { game, currentParticipant, participants } = useAppSelector(
    state => state.game,
  );
  const loadingFetchPreviousGame = useRef(false);
  const loadingGameState = useRef(false);
  const loadingCountdown = useRef(false);
  const loadingAnswer = useRef(false);
  const didStartGame = useRef(false);

  const getStage = useCallback(() => game?.stage, [game]);

  const getGameSession = async (code: string) => {
    try {
      const gameResponse = await axios.get<GameSession>(
        `/api/game/${code}/session`,
      );
      const gameSession = gameResponse.data;
      return gameSession;
    } catch (error: any) {
      Logger.error(error);
      throw error;
    }
  };

  const joinGame = async (code: string, name: string) => {
    try {
      const joinRoomResponse = await axios.post<GameSession>(
        `/api/game/${code}/join`,
        {
          name,
        },
      );

      const gameSession = joinRoomResponse.data;
      const participants = gameSession.participants || [];
      dispatch(setRoom({ ...gameSession.room, userId: user?.userId || "" }));
      updateGame(gameSession.game);
      updateCounters(gameSession.counters);
      dispatch(
        setParticipants({
          participants,
          currentUserId: user?.userId,
        }),
      );
      writeGameJoinedToLocalStorage(code, gameSession.participants);

      return gameSession;
    } catch (error: any) {
      if (error.response.status === 400) {
        throw new NameTakenError();
      }
      Logger.error(error);
      throw error;
    }
  };

  const updateGame = (newGame: Game) => dispatch(setGame(newGame));

  const updateCounters = (counters: Counters) =>
    dispatch(setCounters(counters));

  const updateParticipants = (participants: Participant[]) =>
    dispatch(setParticipants({ participants, currentUserId: user?.userId }));

  async function setPreviouslyJoinedGame(
    code: string,
    userId: string,
  ): Promise<GameSession | null> {
    try {
      if (loadingFetchPreviousGame.current) {
        return null;
      }
      loadingFetchPreviousGame.current = true;

      const gameSession = await getGameSession(code);
      if (gameSession) {
        const participants = gameSession?.participants || [];
        const isRoomOwner = gameSession?.room.createdBy === userId;
        if (isRoomOwner || participants.find(p => p.userId === userId)) {
          dispatch(setRoom({ ...gameSession.room, userId }));
          updateGame(gameSession.game);
          updateCounters(gameSession.counters);
          dispatch(setParticipants({ participants, currentUserId: userId }));
          return gameSession;
        }
      }
      return null;
    } catch (error: any) {
      Logger.error(error);
      throw error;
    } finally {
      loadingFetchPreviousGame.current = false;
    }
  }

  const answerQuestion = async (
    response: QuestionOption,
    code: string,
    questionId: string,
  ) => {
    if (loadingAnswer.current) {
      throw new LoadingError("Loading answer");
    }
    loadingAnswer.current = true;

    if (!currentParticipant) {
      throw new Error("Participant not found");
    }

    if (
      currentParticipant.questionResponses?.find(
        qr => qr.questionId === questionId,
      )
    ) {
      return;
    }

    dispatch(addQuestionResponse({ response })); // optimistic update
    try {
      const responseWithAnsweredAt: Partial<QuestionOption> = {
        ...response,
        answeredAt: Date.now(),
      };
      await axios.post(`/api/game/${code}/question/${questionId}/answer`, {
        response: { ...responseWithAnsweredAt },
      });
      return;
    } catch (error: any) {
      Logger.error(error);
      dispatch(removeQuestionResponse({ questionId })); // rollback
      throw error;
    } finally {
      loadingAnswer.current = false;
    }
  };

  async function startGame(code: string) {
    if (loadingCountdown.current) {
      throw new LoadingError("Loading countdown");
    }
    if (didStartGame.current) {
      return;
    }
    const x = participants;

    if (participants?.length < 1) {
      throw new NoParticipantsError("No participants");
    }

    loadingCountdown.current = true;
    try {
      if (game?.stage === "lobby") {
        await axios.post(`/api/game/${code}/startCountdown`);
        await axios.post(`/api/game/${code}/start`);
      }
      loadingCountdown.current = false;
      didStartGame.current = true;

      let gameOver = false;
      while (!gameOver) {
        try {
          const response = await axios.post<{ gameOver: boolean }>(
            `/api/game/${code}/question/run`,
          );
          gameOver = response.data.gameOver && !isGameRunning(game?.stage);
        } catch (error: any) {
          Logger.error("Failed to start question", {
            error,
            data: { game, currentParticipant },
          });
        }
      }
      return;
    } catch (error: any) {
      Logger.error(error);
      throw error;
    } finally {
      loadingCountdown.current = false;
      didStartGame.current = false;
    }
  }

  async function leaveGame(code: string, name: string) {
    try {
      await axios.post(`/api/game/${code}/leave`, { name });
    } catch (error: any) {
      Logger.error(error);
      throw error;
    }
  }

  async function pauseGame(code: string) {
    if (loadingGameState.current) {
      throw new LoadingError("Loading pause");
    }
    loadingGameState.current = true;
    try {
      const gameRef = gameDocClient(code);
      if (!gameRef) {
        throw new Error("Game not found"); // You can create a custom error class for better error handling if needed
      }

      const newGame: Partial<Game> = {
        stage: "paused",
        previousStage: game?.stage,
      };

      await updateDoc(gameRef, newGame);
      return;
    } catch (error: any) {
      Logger.error(error);
      throw error;
    } finally {
      loadingGameState.current = false;
    }
  }

  async function resumeGame(code: string) {
    if (loadingGameState.current) {
      throw new LoadingError("Loading pause");
    }
    loadingGameState.current = true;
    try {
      const gameRef = gameDocClient(code);
      if (!gameRef) {
        throw new Error("Game not found");
      }

      const newGame: Partial<Game> = {
        stage: game?.previousStage || "lobby",
        previousStage: "paused",
      };

      await updateDoc(gameRef, newGame);

      return;
    } catch (error: any) {
      Logger.error(error);
      throw error;
    } finally {
      loadingGameState.current = false;
    }
  }
  // api/game/[code]/restart
  const restartGame = async (code: string) => {
    if (loadingGameState.current) {
      throw new LoadingError("Loading pause");
    }
    loadingGameState.current = true;
    try {
      await axios.post(`/api/game/${code}/restart`);
      await startGame(code);
    } catch (error: any) {
      Logger.error(error);
      throw error;
    } finally {
      loadingGameState.current = false;
    }
  };

  const listenToGameChanges = (
    code: string,
    onChange: (newGame: Game) => void,
    onError?: (error: any) => void,
  ): Unsubscribe => {
    let unsubscribe = () => {};
    const roomRef = gameDocClient(code);
    if (roomRef) {
      unsubscribe = onSnapshot(
        roomRef,
        snapshot => {
          console.log("Game snapshot", snapshot.data());
          onChange(snapshot.data() as Game);
        },
        (error: any) => {
          Logger.error(error);
          onError?.(error);
        },
      );
    }

    return unsubscribe;
  };

  const listenToParticipantsChanges = (
    code: string,
    onChange: (participants: Participant[]) => void,
    onError?: (error: any) => void,
  ): Unsubscribe => {
    let unsubscribe = () => {};
    const roomRef = participantsColClient(code);
    if (roomRef) {
      unsubscribe = onSnapshot(
        roomRef,
        snapshot => {
          onChange(snapshot.docs.map(doc => doc.data() as Participant));
        },
        (error: any) => {
          Logger.error(error);
          onError?.(error);
        },
      );
    }

    return unsubscribe;
  };

  const listenToCountersChanges = (
    code: string,
    onChange: (counters: Counters) => void,
    onError?: (error: any) => void,
  ): Unsubscribe => {
    let unsubscribe = () => {};
    const countersRef = countersDocClient(code);
    if (countersRef) {
      unsubscribe = onSnapshot(
        countersRef,
        snapshot => {
          console.log("Counters snapshot", snapshot.data());
          onChange(snapshot.data() as Counters);
        },
        (error: any) => {
          Logger.error(error);
          onError?.(error);
        },
      );
    }

    return unsubscribe;
  };

  const fetchParticipants = async (code: string) => {
    try {
      const participantsRef = participantsColClient(code);
      if (!participantsRef) {
        throw new Error("Participants not found");
      }
      const response = await getDocs(participantsRef);
      const participants = response.docs.map(doc => doc.data() as Participant);
      updateParticipants(participants);
    } catch (error: any) {
      Logger.error(error);
      throw error;
    }
  };

  const isCurrentQuestionAnsweredCorrectly = () => {
    if (!game || !user) return false;
    if (!currentParticipant) return false;
    const currentQuestion = game.currentQuestion;
    if (!currentQuestion) return false;

    const questionResponse = currentParticipant.questionResponses?.find(
      qr => qr.questionId === currentQuestion.id,
    );
    if (!questionResponse) return false;
    return questionResponse.correct;
  };

  return {
    isCurrentQuestionAnsweredCorrectly,
    getStage,
    updateGame,
    updateCounters,
    updateParticipants,
    fetchParticipants,
    getGameSession,
    joinGame,
    startGame,
    leaveGame,
    pauseGame,
    resumeGame,
    restartGame,
    answerQuestion,
    clearLocalGame,
    listenToGameChanges,
    listenToCountersChanges,
    setPreviouslyJoinedGame,
    listenToParticipantsChanges,
    loadingAnswer: loadingAnswer.current,
    loadingCountdown: loadingCountdown.current,
    loadingGameState: loadingGameState.current,
  };
}
