import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import {
  Difficulty,
  Question,
  QuestionId,
  QuestionResponse,
  QuestionType,
} from "../../../models/question";

export type Theme = "light" | "dark" | "blossom" | "midnight" | "sun";
export type QuestionsStatus = "idle" | "loading" | "succeeded" | "failed";

export interface GameState {
  theme: Theme;
  game: QuestionType;
  difficulty: Difficulty;
  questions: Question[];
  questionsResponses: QuestionResponse[];
  questionsStatus?: QuestionsStatus;
}

export const initialState: GameState = {
  theme: "sun",
  game: "swipe",
  difficulty: "debut",
  questions: [],
  questionsResponses: [],
  questionsStatus: "idle",
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGame: (
      state,
      action: PayloadAction<{ game: QuestionType; setTheme?: boolean }>,
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
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
    addQuestion: (state, action: PayloadAction<Question>) => {
      state.questions.push(action.payload);
    },
    removeQuestion: (state, action: PayloadAction<QuestionId>) => {
      state.questions = state.questions.filter(
        question => question.id !== action.payload,
      );
    },
    updateQuestion: (
      state,
      action: PayloadAction<{ id: QuestionId; question: Question }>,
    ) => {
      state.questions = state.questions.map(question =>
        question.id === action.payload.id ? action.payload.question : question,
      );
    },
    updateQuestionStatus: (
      state,
      action: PayloadAction<{ status: QuestionsStatus }>,
    ) => {
      state.questionsStatus = action.payload.status;
    },
    addQuestionResponse: (state, action: PayloadAction<QuestionResponse>) => {
      state.questionsResponses.push(action.payload);
    },
    updateQuestionResponse: (
      state,
      action: PayloadAction<QuestionResponse>,
    ) => {
      state.questionsResponses = state.questionsResponses.map(response =>
        response.id === action.payload.id ? action.payload : response,
      );
    },
    removeQuestionResponse: (
      state,
      action: PayloadAction<{id: string}>,
    ) => {
      state.questionsResponses = state.questionsResponses.filter(
        response => response.id !== action.payload.id,
      );
    },
  },
});

export const {
  addQuestion,
  addQuestionResponse,
  setDifficulty,
  removeQuestion,
  removeQuestionResponse,
  setGame,
  setTheme,
  setQuestions,
  updateQuestion,
  updateQuestionResponse,
  updateQuestionStatus,
} = gameSlice.actions;

export const selectAuth = (state: RootState): GameState => state.game;

export default gameSlice.reducer;
