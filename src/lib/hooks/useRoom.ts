import axios from "axios";
import Room, { Participant } from "../../models/room";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../../../firebase.config";
import { useAppSelector } from "./redux";

export type Unsubscribe = () => void;

export default function useRoom() {
  async function createRoom(name: string): Promise<string> {
    try {
      const response = await axios.post("/api/game/create", { name });
      return response.data.code;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function joinRoom(code: string, name: string): Promise<Participant> {
    try {
      const joinRoomResponse = await axios.post(`/api/game/${code}/join`, {
        name,
      });
      return joinRoomResponse.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function leaveRoom(code: string, name: string) {
    try {
      await axios.post(`/api/game/${code}/leave`, { name });
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
  };
}
