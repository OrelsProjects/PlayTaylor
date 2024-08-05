import axios from "axios";
import Room, { Participant } from "../../models/room";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase.config";
import { useAppDispatch, useAppSelector } from "./redux";
import { setRoom, setUserParticipant } from "../features/room/roomSlice";

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
  async function createRoom(name: string): Promise<string> {
    try {
      const response = await axios.post("/api/game/create", { name });
      return response.data.code;
    } catch (error) {
      console.error(error);
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
    try {
      await axios.get(`/api/game/${code}/start`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

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
    listenToRoomChanges,
    setPreviouslyJoinedRoom,
  };
}
