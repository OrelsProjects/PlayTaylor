import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import Room, { Participant } from "../../../models/room";
import { QuestionResponse } from "../../../models/question";

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
    updateParticipant: (state, action: PayloadAction<Participant>) => {
      if (state.room) {
        const index = state.room.participants.findIndex(
          p => p.name === action.payload.name,
        );
        if (index !== -1) {
          state.room.participants[index] = action.payload;
        }
      }
    },
    addQuestionResponse: (
      state,
      action: PayloadAction<{ participantName: string; response: QuestionResponse }>,
    ) => {
      if (state.room) {
        const participantIndex = state.room.participants.findIndex(
          p => p.name === action.payload.participantName,
        );
        if (participantIndex !== -1) {
          const participant = state.room.participants[participantIndex];
          if (!participant.questionResponses) {
            participant.questionResponses = [];
          }
          participant.questionResponses.push(action.payload.response);
        }
      }
    }
  },
});

export const { addQuestionResponse, setRoom, setUserParticipant, updateParticipant } =
  roomSlice.actions;

export const selectAuth = (state: RootState): RoomState => state.room;

export default roomSlice.reducer;
