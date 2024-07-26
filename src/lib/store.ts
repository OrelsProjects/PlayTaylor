import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import gameReducer from "./features/game/gameSlice";
import roomReducer from "./features/room/roomSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      game: gameReducer,
      room: roomReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
