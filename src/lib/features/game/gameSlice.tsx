import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import { Game, Participant } from "@/models/game";
import { QuestionOption } from "@/models/question";

export interface GameState {
  game?: Game;
  participants: Participant[];
  currentParticipant?: Participant;
}

export const initialState: GameState = {
  game: undefined,
  participants: [],
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGame: (state, action: PayloadAction<Game>) => {
      state.game = action.payload;
    },
    setParticipants: (
      state,
      action: PayloadAction<{
        participants: Participant[];
        currentUserId?: string;
      }>,
    ) => {
      state.participants = action.payload.participants;
      state.currentParticipant = action.payload.participants.find(
        participant => participant.userId === action.payload.currentUserId,
      );
    },
    addQuestionResponse: (
      state,
      action: PayloadAction<{ response: QuestionOption }>,
    ) => {
      if (!state.currentParticipant) return;
      const questionResponses =
        state.currentParticipant.questionResponses || [];

      const existingResponse = questionResponses.find(
        r => r.questionId === action.payload.response.questionId,
      );

      if (existingResponse) {
        return;
      }

      questionResponses.push(action.payload.response);
      state.currentParticipant.questionResponses = questionResponses;
      state.participants = state.participants.map(participant =>
        participant.userId === state.currentParticipant?.userId
          ? state.currentParticipant
          : participant,
      );
    },
    removeQuestionResponse: (
      state,
      action: PayloadAction<{ questionId: string }>,
    ) => {
      if (!state.currentParticipant) return;

      state.currentParticipant.questionResponses =
        state.currentParticipant.questionResponses?.filter(
          r => r.questionId !== action.payload.questionId,
        );

      state.participants = state.participants.map(participant =>
        participant.userId === state.currentParticipant?.userId
          ? state.currentParticipant
          : participant,
      );
    },
  },
});

export const {
  setGame,
  setParticipants,
  addQuestionResponse,
  removeQuestionResponse,
} = gameSlice.actions;

export const selectAuth = (state: RootState): GameState => state.game;

export default gameSlice.reducer;
