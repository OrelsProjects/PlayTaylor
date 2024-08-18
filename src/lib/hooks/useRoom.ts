import axios from "axios";
import Room, { CreateRoom, Participant } from "../../models/room";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/../firebase.config";
import { useAppDispatch, useAppSelector } from "./redux";
import { setRoom, setUserParticipant } from "../features/room/roomSlice";
import {
  setPin,
  setGameDifficulty,
  setGameName,
  setQuestions,
  setParticipantsCount,
  setQuestionsCount,
} from "../features/game/gameSlice";
import { Logger } from "../../logger";
import { Difficulty } from "../../models/question";
import { useRef } from "react";
import LoadingError from "../../models/errors/LoadingError";

export type Stage = "name" | "participants" | "difficulty" | "question";

export const LOCAL_STORAGE_PREFIX = "create_game_play_tayor";

export const buildLocalSotrageKey = (key: string) =>
  `${LOCAL_STORAGE_PREFIX}_${key}`;

const writeCodeToLocal = (pin: string) => {
  localStorage.setItem(buildLocalSotrageKey("pin"), pin);
};

const readCodeFromLocal = () => {
  return localStorage.getItem(buildLocalSotrageKey("pin"));
};

export type Unsubscribe = () => void;

type Rooms = {
  participant: Participant;
  code: string;
}[];

const getRoomsJoined = (): Rooms => {
  const rooms = localStorage.getItem("rooms") || "[]";
  return JSON.parse(rooms);
};

const saveRoomJoined = (code: string, participant: Participant) => {
  let rooms = getRoomsJoined();
  const joinedRoom = rooms.find(room => room.code === code);
  if (joinedRoom) {
    // update participant
    joinedRoom.participant = participant;
    rooms = rooms.map(room => (room.code === code ? joinedRoom : room));
  } else {
    rooms.push({ code, participant });
  }
  localStorage.setItem("rooms", JSON.stringify(rooms));
};

const getRoomJoinedParticipant = (code: string): Participant | null => {
  const rooms = getRoomsJoined();
  const room = rooms.find(room => room.code === code);
  return room?.participant || null;
};

const removeRoomJoined = (code: string) => {
  let rooms = getRoomsJoined();
  rooms = rooms.filter(room => room.code !== code);
  localStorage.setItem("rooms", JSON.stringify(rooms));
};

export default function useRoom() {
  const dispatch = useAppDispatch();
  const { room, userParticipant } = useAppSelector(state => state.room);
  const loadingCountdown = useRef(false);

  async function createRoom(room: CreateRoom): Promise<string> {
    try {
      const response = await axios.post("/api/game/create", room);
      dispatch(setPin(response.data.code));
      writeCodeToLocal(response.data.code);
      return response.data.code;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function setPreviouslyCreatedRoom(code: string) {
    try {
      const room = await getRoom(code);
      dispatch(setRoom(room));
      dispatch(setPin(code));
      dispatch(setGameName(room.name));
      dispatch(setParticipantsCount(room.participants.length || 0));
      dispatch(setQuestionsCount(room.questions.length));
      dispatch(
        setGameDifficulty(
          (room.questions?.[0]?.difficulty as Difficulty) || "debut",
        ),
      );
      dispatch(setQuestions(room.questions || []));

      return room;
    } catch (error: any) {
      Logger.error(error);
      throw error;
    }
  }

  async function setPreviouslyJoinedRoom(
    code: string,
  ): Promise<{ room: Room; participant: Participant } | null> {
    try {
      if (room?.code === code && userParticipant) {
        return { room, participant: userParticipant };
      }
      const participant = getRoomJoinedParticipant(code);
      if (participant) {
        const room = await getRoom(code);
        dispatch(setUserParticipant(participant));
        dispatch(setRoom(room));
        return { room, participant };
      }
      return null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function joinRoom(room: Room, name: string): Promise<Participant> {
    try {
      const joinRoomResponse = await axios.post<Participant>(
        `/api/game/${room.code}/join`,
        {
          name,
        },
      );
      const participant = joinRoomResponse.data;
      dispatch(setUserParticipant(participant));
      dispatch(setRoom(room));
      saveRoomJoined(room.code, participant);

      return participant;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function leaveRoom(code: string, name: string) {
    try {
      await axios.post(`/api/game/${code}/leave`, { name });
      removeRoomJoined(name);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function getRoom(code: string): Promise<Room> {
    try {
      const response = await axios.get<Room>(`/api/game/${code}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function startGame(code: string) {
    if (loadingCountdown.current) {
      throw new LoadingError("Loading countdown");
    }
    loadingCountdown.current = true;
    try {
      await axios.post(`/api/game/${code}/startCountdown`);
      await axios.post(`/api/game/${code}/start`);
      return;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      loadingCountdown.current = false;
    }
  }

  const listenDefaults = {
    onChange: (newRoom: Room) => {
      dispatch(setRoom(newRoom));
    },
  };

  const listenToRoomChanges = (
    code: string,
    onChange: (newRoom: Room) => void,
    onError?: (error: any) => void,
  ): Unsubscribe => {
    let unsubscribe = () => {};
    if (db) {
      const roomRef = doc(db, "rooms", code);
      unsubscribe = onSnapshot(
        roomRef,
        snapshot => {
          onChange(snapshot.data() as Room);
        },
        error => {
          if (!onError) {
            console.log("Failed to subscribe to room updates:", error);
          }
          onError?.(error);
        },
      );
    }
    return unsubscribe;
  };

  return {
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    getRoom,
    loadingCountdown: loadingCountdown.current,
    listenDefaults,
    listenToRoomChanges,
    setPreviouslyJoinedRoom,
    setPreviouslyCreatedRoom,
  };
}
