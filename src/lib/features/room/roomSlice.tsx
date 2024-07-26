import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import Room, { Participant } from "../../../models/room";

export interface RoomState {
  room?: Room;
  userParticipant?: Participant;
}

export const initialState: RoomState = {
  room: undefined,
  userParticipant: undefined,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoom: (state, action: PayloadAction<Room>) => {
      state.room = action.payload;
    },
    setUserParticipant: (state, action: PayloadAction<Participant>) => {
      state.userParticipant = action.payload;
    },
  },
});

export const { setRoom, setUserParticipant } = roomSlice.actions;

export const selectAuth = (state: RootState): RoomState => state.room;

export default roomSlice.reducer;
