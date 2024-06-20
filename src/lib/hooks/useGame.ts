import { useTheme } from "next-themes";
import { useAppDispatch, useAppSelector } from "./redux";
import {
  Game,
  setGame as setGameAction,
  setTheme as setThemeAction,
  setDifficulty as setDifficultyAction,
  Theme,
  Difficulty,
} from "../features/game/gameSlice";
import { useCallback } from "react";

const useGame = () => {
  const dispatch = useAppDispatch();
  const { game, theme } = useAppSelector(state => state.game);
  const { setTheme: setSystemTheme, resolvedTheme } = useTheme();

  const getGameTheme = useCallback((game: Game): Theme => {
    switch (game) {
      case "trivia":
        return "sun";
      case "sing-the-lyrics":
        return "blossom";
      case "swipe":
        return "midnight";
    }
  }, []);

  const setGame = (game: Game) => {
    const shouldSetTheme = resolvedTheme !== "dark";
    if (shouldSetTheme) {
      setSystemTheme(getGameTheme(game));
    }
    dispatch(setGameAction({ game, setTheme: shouldSetTheme }));
  };

  const setTheme = (darkTheme?: boolean) => {
    const newTheme = darkTheme ? "dark" : getGameTheme(game);
    if (!darkTheme) {
      dispatch(setThemeAction(newTheme));
    }
    setSystemTheme(newTheme);
  };

  const setDifficulty = (difficulty: Difficulty) => {
    dispatch(setDifficultyAction(difficulty));
  };

  return { game, theme, setGame, setTheme, setDifficulty };
};

export default useGame;
