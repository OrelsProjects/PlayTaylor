import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import {
  Difficulty,
  QuestionId,
  QuestionResponse,
  QuestionsStatus,
} from "@/models/question";
import { Question } from "@prisma/client";

export interface GameState {
  gameName?: string;
  difficulty?: Difficulty;
  participantsCount?: number;
  questionsCount?: number;
  pin?: string;
  questions: Question[];
  questionsResponses: QuestionResponse[];
  questionsStatus?: QuestionsStatus;
}

export const initialState: GameState = {
  gameName: undefined,
  difficulty: undefined,
  questionsCount: undefined,
  participantsCount: undefined,
  pin: undefined,
  questions: [],
  questionsResponses: [],
  questionsStatus: "idle",
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameName: (state, action: PayloadAction<string>) => {
      state.gameName = action.payload;
    },
    setParticipantsCount: (state, action: PayloadAction<number>) => {
      state.participantsCount = action.payload;
    },
    setGameDifficulty: (state, action: PayloadAction<Difficulty>) => {
      state.difficulty = action.payload;
    },
    setQuestionsCount: (state, action: PayloadAction<number>) => {
      state.questionsCount = action.payload;
    },
    setPin: (state, action: PayloadAction<string>) => {
      state.pin = action.payload;
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
    removeQuestionResponse: (state, action: PayloadAction<{ id: string }>) => {
      state.questionsResponses = state.questionsResponses.filter(
        response => response.id !== action.payload.id,
      );
    },
  },
});

export const {
  addQuestion,
  addQuestionResponse,
  setGameDifficulty,
  removeQuestion,
  removeQuestionResponse,
  setGameName,
  setParticipantsCount,
  setPin,
  setQuestionsCount,
  setQuestions,
  updateQuestion,
  updateQuestionResponse,
  updateQuestionStatus,
} = gameSlice.actions;

export const selectAuth = (state: RootState): GameState => state.game;

export default gameSlice.reducer;
