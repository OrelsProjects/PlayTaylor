import axios from "axios";
import Room, { CreateRoom } from "@/models/room";
import { onSnapshot } from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import {
  setGameDifficulty,
  setGameName,
  setParticipantsCount,
  setQuestionsCount,
  setRoom,
  setWasInConfirm,
} from "@/lib/features/room/roomSlice";
import { Logger } from "@/logger";
import { Difficulty } from "@/models/question";
import { roomDocClient } from "@/lib/utils/firestoreClient";
import { GameSession } from "@/models/game";

export type Unsubscribe = () => void;

export default function useRoom() {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  async function createRoom(room: CreateRoom): Promise<string> {
    try {
      const response = await axios.post<GameSession>("/api/game/create", room);
      dispatch(setRoom({ ...response.data.room, userId: user?.userId || "" }));
      return response.data.room.code;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function setPreviouslyCreatedRoom(code: string) {
    try {
      const room = await getRoom(code);
      dispatch(
        setRoom({
          ...room,
          code,
          questions: room.questions || [],
          userId: user?.userId || "",
        }),
      );
    } catch (error: any) {
      Logger.error(error);
      throw error;
    }
  }

  const updateRoom = (room: Room) => {
    dispatch(setRoom({ ...room, userId: user?.userId || "" }));
  };

  const updateGameName = (name: string) => {
    dispatch(setGameName(name));
  };

  const updateParticipants = (participants: number) => {
    dispatch(setParticipantsCount(participants));
  };

  const updateDifficulty = (difficulty: Difficulty) => {
    dispatch(setGameDifficulty(difficulty));
  };

  const updateQuestionsCount = (count: number) => {
    dispatch(setQuestionsCount(count));
  };

  const updateWasInConfirm = (wasInConfirm: boolean) => {
    dispatch(setWasInConfirm(wasInConfirm));
  };

  async function getRoom(code: string): Promise<Room> {
    try {
      const response = await axios.get<Room>(`/api/game/${code}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const listenDefaults = {
    onChange: (newRoom: Room) => {
      dispatch(setRoom({ ...newRoom, userId: user?.userId || "" }));
    },
  };

  const listenToRoomChanges = (
    code: string,
    onChange: (newRoom: Room) => void,
    onError?: (error: any) => void,
  ): Unsubscribe => {
    let unsubscribe = () => {};
    const roomRef = roomDocClient(code);
    if (roomRef) {
      unsubscribe = onSnapshot(
        roomRef,
        snapshot => {
          onChange(snapshot.data() as Room);
        },
        (error: any) => {
          Logger.error(error);
          onError?.(error);
        },
      );
    }

    return unsubscribe;
  };

  return {
    getRoom,
    createRoom,
    listenDefaults,
    updateRoom,
    updateGameName,
    updateParticipants,
    updateWasInConfirm,
    updateQuestionsCount,
    updateDifficulty,
    listenToRoomChanges,
    setPreviouslyCreatedRoom,
  };
}
