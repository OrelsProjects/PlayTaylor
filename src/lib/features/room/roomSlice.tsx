import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import Room from "@/models/room";
import { Difficulty, Question, QuestionId } from "@/models/question";

export interface RoomState {
  room: Omit<Room, "difficulty" | "questionsCount"> & {
    difficulty?: Difficulty;
    questionsCount?: number;
  };
}

export const initialState: RoomState = {
  room: {
    code: "",
    name: "",
    createdBy: "",
    participantsCount: 0,
    questions: [],
  },
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoom: (state, action: PayloadAction<Room>) => {
      state.room = action.payload;
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
  },
});

export const {
  setRoom,
  setGameName,
  setParticipantsCount,
  setGameDifficulty,
  setQuestionsCount,
  setCode,
  setQuestions,
  addQuestion,
  removeQuestion,
} = roomSlice.actions;

export const selectAuth = (state: RootState): RoomState => state.room;

export default roomSlice.reducer;
