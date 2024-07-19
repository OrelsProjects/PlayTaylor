import axios from "axios";

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

  async function joinRoom(code: string, name: string) {
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

  async function getRoom(code: string) {
    try {
      const response = await axios.get(`/api/game/${code}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return { createRoom, joinRoom, leaveRoom, getRoom };
}
