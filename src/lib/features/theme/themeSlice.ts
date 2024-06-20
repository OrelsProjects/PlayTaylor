import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import _ from "lodash";

export type Theme = "light" | "dark" | "blossom" | "midnight" | "sun";

export interface ThemeState {
  theme: Theme;
}

export const initialState: ThemeState = {
  theme: "sun",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {},
});

export const {} = themeSlice.actions;

export const selectAuth = (state: RootState): ThemeState => state.theme;

export default themeSlice.reducer;
