import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import _ from "lodash";

export type Game = "trivia" | "sing-the-lyrics" | "swipe";
export type Difficulty = "debut" | "midnights" | "folklore";
export type Theme = "light" | "dark" | "blossom" | "midnight" | "sun";

export interface GameState {
  theme: Theme;
  game: Game;
  difficulty: Difficulty;
}

export const initialState: GameState = {
  theme: "sun",
  game: "swipe",
  difficulty: "debut",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setGame: (
      state,
      action: PayloadAction<{ game: Game; setTheme?: boolean }>,
    ) => {
      state.game = action.payload.game;
      if (!action.payload.setTheme) return;
      switch (action.payload.game) {
        case "swipe":
          state.theme = "sun";
          break;
        case "sing-the-lyrics":
          state.theme = "blossom";
          break;
        case "trivia":
          state.theme = "midnight";
          break;
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setDifficulty: (state, action) => {
      state.difficulty = action.payload;
    },
  },
});

export const { setGame, setTheme, setDifficulty } = themeSlice.actions;

export const selectAuth = (state: RootState): GameState => state.game;

export default themeSlice.reducer;
