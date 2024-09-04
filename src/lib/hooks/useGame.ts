"use client";

/**
 * @file This file contains the useGame hook which is used to manage the game state.
 * It is used to update the game state, answer questions, and manage the game state in the local storage.
 */

import { useMemo, useRef, useState } from "react";
import axios from "axios";
import { onSnapshot } from "firebase/firestore";
import { Logger } from "@/logger";
import { QuestionOption } from "@/models/question";
import { useAppDispatch, useAppSelector } from "./redux";
import { buildLocalSotrageKey } from "@/lib/hooks/_utils";
import LoadingError from "@/models/errors/LoadingError";
import { Game, GameSession, Participant } from "@/models/game";
import { setRoom } from "@/lib/features/room/roomSlice";
import { setGame, setParticipants } from "@/lib/features/game/gameSlice";
import { NameTakenError } from "@/models/errors/NameTakenError";
import {
  gameDocClient,
  participantsColClient,
} from "@/lib/utils/firestoreClient";

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
  const { game } = useAppSelector(state => state.game);
  const [loadingGameState, setLoadingGameState] = useState(false);
  const loadingCountdown = useRef(false);
  const loadingAnswer = useRef(false);

  const getGameSession = async (code: string) => {
    try {
      const gameResponse = await axios.get<GameSession>(
        `/api/game/${code}/session`,
      );
      const gameSession = gameResponse.data;
      return gameSession;
    } catch (error) {
      console.error(error);
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
      dispatch(setRoom(gameSession.room));
      dispatch(setGame(gameSession.game));
      dispatch(setParticipants(gameSession.participants || []));
      writeGameJoinedToLocalStorage(code, gameSession.participants);

      return gameSession;
    } catch (error: any) {
      if (error.response.status === 400) {
        throw new NameTakenError();
      }
      console.error(error);
      throw error;
    }
  };

  const updateGame = (newGame: Game) => dispatch(setGame(newGame));
  const updateParticipants = (participants: Participant[]) =>
    dispatch(setParticipants(participants));

  async function setPreviouslyJoinedGame(
    code: string,
  ): Promise<GameSession | null> {
    try {
      const gameSession = await getGameSession(code);
      const isOwner = gameSession.room.createdBy === user?.userId;

      const participants = gameSession?.participants || [];
      if (isOwner || participants.find(p => p.userId === user?.userId)) {
        if (gameSession) {
          dispatch(setRoom(gameSession.room));
          dispatch(setGame(gameSession.game));
          dispatch(setParticipants(gameSession.participants || []));
          return gameSession;
        }
      }
      return null;
    } catch (error) {
      console.error(error);
      throw error;
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
    try {
      await axios.post(`/api/game/${code}/question/${questionId}/answer`, {
        response: { ...response, answerAt: Date.now() },
        questionId,
      });
      return;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      loadingAnswer.current = false;
    }
  };

  async function startGame(code: string) {
    if (loadingCountdown.current) {
      throw new LoadingError("Loading countdown");
    }
    loadingCountdown.current = true;
    try {
      await axios.post(`/api/game/${code}/startCountdown`);
      await axios.post(`/api/game/${code}/start`);
      axios.post(`/api/game/${code}/question/run`).catch(error => {
        console.error("Failed to start question", error);
        Logger.error(error);
      });
      return;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      loadingCountdown.current = false;
    }
  }

  async function leaveGame(code: string, name: string) {
    try {
      await axios.post(`/api/game/${code}/leave`, { name });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function pauseGame(code: string) {
    if (loadingGameState) {
      throw new LoadingError("Loading pause");
    }
    setLoadingGameState(true);
    try {
      await axios.post(`/api/game/${code}/pause`, {
        pausedAt: Date.now(),
      });
      return;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoadingGameState(false);
    }
  }

  async function resumeGame(code: string) {
    if (loadingGameState) {
      throw new LoadingError("Loading pause");
    }
    setLoadingGameState(true);
    try {
      await axios.post(`/api/game/${code}/resume`);
      return;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoadingGameState(false);
    }
  }

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
          debugger;
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

  const userParticipant = useMemo(() => {
    if (!game || !user) return null;
    return game.participants?.find(p => p.userId === user.userId);
  }, [game, user]);

  return {
    userParticipant,

    updateGame,
    updateParticipants,
    getGameSession,
    joinGame,
    startGame,
    leaveGame,
    pauseGame,
    resumeGame,
    answerQuestion,
    clearLocalGame,
    loadingGameState,
    listenToGameChanges,
    setPreviouslyJoinedGame,
    listenToParticipantsChanges,
    loadingAnswer: loadingAnswer.current,
    loadingCountdown: loadingCountdown.current,
  };
}
