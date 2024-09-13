import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import Room from "@/models/room";
import { Difficulty, Question, QuestionId } from "@/models/question";

export interface RoomState {
  room: Omit<Room, "difficulty" | "questionsCount"> & {
    difficulty?: Difficulty;
    questionsCount?: number;
  };
  wasInConfirm: boolean;
}

export const initialState: RoomState = {
  room: {
    code: "",
    name: "",
    createdBy: "",
    isAdmin: false,
    participantsCount: 0,
    createdAt: 0,
    questions: [],
  },
  wasInConfirm: false,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoom: (state, action: PayloadAction<Room & { userId: string }>) => {
      state.room = action.payload;
      state.room.isAdmin = action.payload.createdBy === action.payload.userId;
    },

    setGameName: (state, action: PayloadAction<string>) => {
      const newRoom = { ...state.room, name: action.payload };
      state.room = newRoom;
    },
    setParticipantsCount: (state, action: PayloadAction<number>) => {
      const newRoom = { ...state.room, participantsCount: action.payload };
      state.room = newRoom;
    },
    setGameDifficulty: (state, action: PayloadAction<Difficulty>) => {
      const newRoom = { ...state.room, difficulty: action.payload };
      state.room = newRoom;
    },
    setQuestionsCount: (state, action: PayloadAction<number>) => {
      const newRoom = { ...state.room, questionsCount: action.payload };
      state.room = newRoom;
    },
    setCode: (state, action: PayloadAction<string>) => {
      const newRoom = { ...state.room, code: action.payload };
      state.room = newRoom;
    },
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      const newRoom = { ...state.room, questions: action.payload };
      state.room = newRoom;
    },
    addQuestion: (state, action: PayloadAction<Question>) => {
      const existingQuestion = state.room.questions.find(
        question => question.id === action.payload.id,
      );
      if (existingQuestion) return;
      const newRoom = {
        ...state.room,
        questions: [...state.room.questions, action.payload],
      };
      state.room = newRoom;
    },
    removeQuestion: (state, action: PayloadAction<QuestionId>) => {
      const newRoom = {
        ...state.room,
        questions: state.room.questions.filter(
          question => question.id !== action.payload,
        ),
      };
      state.room;
    },
    setWasInConfirm: (state, action: PayloadAction<boolean>) => {
      state.wasInConfirm = action.payload;
    },
  },
});

export const {
  setRoom,
  setGameName,
  setParticipantsCount,
  setGameDifficulty,
  setQuestionsCount,
  setCode,
  setWasInConfirm,
  setQuestions,
  addQuestion,
  removeQuestion,
} = roomSlice.actions;

export const selectAuth = (state: RootState): RoomState => state.room;

export default roomSlice.reducer;
