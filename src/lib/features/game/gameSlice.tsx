import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import { Game, Participant } from "@/models/game";

export interface GameState {
  game?: Game;
  participants: Participant[];
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
    setParticipants: (state, action: PayloadAction<Participant[]>) => {
      state.participants = action.payload;
    },
    addParticipant: (state, action: PayloadAction<Participant>) => {
      const existingParticipant = state.participants.find(
        participant =>
          participant.userId === action.payload.userId ||
          participant.name === action.payload.name,
      );
      if (!existingParticipant) {
        state.participants.push(action.payload);
      }
    },
  },
});

export const { setGame, setParticipants, addParticipant } = gameSlice.actions;

export const selectAuth = (state: RootState): GameState => state.game;

export default gameSlice.reducer;
