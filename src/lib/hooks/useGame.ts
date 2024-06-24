import { useTheme } from "next-themes";
import { useAppDispatch, useAppSelector } from "./redux";
import {
  setGame as setGameAction,
  setTheme as setThemeAction,
  setDifficulty as setDifficultyAction,
  setQuestions as setQuestionsAction,
  addQuestion as addQuestionAction,
  removeQuestion as removeQuestionAction,
  updateQuestion as updateQuestionAction,
  updateQuestionStatus as updateQuestionStatusAction,
  Theme,
} from "../features/game/gameSlice";
import { useCallback, useMemo } from "react";
import { Difficulty, Question, QuestionId, QuestionType } from "../../models/question";
import { Logger } from "../../logger";
import axios from "axios";
import { Images, imagesToUrl } from "../../components/dropdown/consts";

const useGame = () => {
  const dispatch = useAppDispatch();
  const { game, theme, questions, questionsStatus } = useAppSelector(
    state => state.game,
  );
  const { setTheme: setSystemTheme, resolvedTheme } = useTheme();

  const getGameTheme = useCallback((game: QuestionType): Theme => {
    switch (game) {
      case "trivia":
        return "sun";
      case "sing-the-lyrics":
        return "blossom";
      case "swipe":
        return "midnight";
    }
  }, []);

  const allQuestions = useMemo(() => {
    return questions;
  }, [questions]);

  const triviaQuestions = useMemo(() => {
    return questions.filter(question => question.type === "trivia");
  }, [questions]);

  const swipeQuestions = useMemo(() => {
    return questions.filter(question => question.type === "swipe");
  }, [questions]);

  const singTheLyricsQuestions = useMemo(() => {
    return questions.filter(question => question.type === "sing-the-lyrics");
  }, [questions]);

  const initQuestions = useCallback(async () => {
    if (questionsStatus === "loading") return;
    try {
      dispatch(updateQuestionStatusAction({ status: "loading" }));
      const response = await axios.get<{ questions: Question[] }>(
        "/api/questions",
      );
      let questions = response.data.questions;
      questions = questions.map(question => {
        const imageUrl = imagesToUrl[question.image as Images] || "";
        return {
          ...question,
          image: imageUrl,
        };
      });
      dispatch(setQuestionsAction(questions));
    } catch (error: any) {
      Logger.error("Failed to fetch questions", { error });
    } finally {
      dispatch(updateQuestionStatusAction({ status: "idle" }));
    }
  }, []);

  const setGame = (game: QuestionType) => {
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

  const setQuestions = (questions: Question[]) => {
    dispatch(setQuestionsAction(questions));
  };

  const addQuestion = async (question: Question) => {
    try {
      dispatch(addQuestionAction({ ...question, id: "temp-id" }));
      const response = await axios.post("/api/questions", { question });
      const newQuestion = response.data.question;
      dispatch(updateQuestionAction({ id: "temp-id", question: newQuestion }));
    } catch (error: any) {
      Logger.error("Failed to add question", { error });
      dispatch(removeQuestionAction("temp-id"));
    }
  };

  const removeQuestion = async (id: QuestionId) => {
    const question = questions.find(question => question.id === id);
    if (!question) throw new Error("Question not found");
    try {
      dispatch(removeQuestionAction(id));
      await axios.delete(`/api/questions/${id}`);
    } catch (error: any) {
      Logger.error("Failed to remove question", { error });
      dispatch(addQuestionAction(question));
    }
  };

  const updateQuestion = async (id: QuestionId, question: Question) => {
    const previousQuestion = questions.find(question => question.id === id);
    if (!previousQuestion) throw new Error("Question not found");
    try {
      dispatch(updateQuestionAction({ id, question }));
      await axios.put(`/api/questions`, { question });
    } catch (error: any) {
      Logger.error("Failed to update question", { error });
      dispatch(updateQuestionAction({ id, question: previousQuestion }));
    }
  };

  return {
    addQuestion,
    allQuestions,
    game,
    initQuestions,
    removeQuestion,
    setGame,
    setTheme,
    setQuestions,
    setDifficulty,
    swipeQuestions,
    singTheLyricsQuestions,
    theme,
    triviaQuestions,
    updateQuestion,
  };
};

export default useGame;
