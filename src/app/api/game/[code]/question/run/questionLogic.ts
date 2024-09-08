import { GameDoesNotExistError } from "@/models/errors/RoomDoesNotExistError";
import {
  Game,
  CURRENT_QUESTION_TIME,
  QUESTION_ENDED_TIME,
  SHOW_LEADERBOARD_TIME,
  Counters,
  GameSession,
} from "@/models/game";
import { GamePausedError } from "@/models/errors/GamePausedError";
import Room from "@/models/room";
import {
  countersDocServer,
  gameDocServer,
  gameSessionDocServer,
  getGameSession,
} from "@/app/api/_db/firestoreServer";
import { CountersDoNotExistError } from "@/models/errors/CountersDoNotExistError";

type GameRef = FirebaseFirestore.DocumentReference<Game, any>;

/**
 * Start countdown of 20 seconds.
 * After the 20 seconds is over, change the stage to "question-ended".
 * Show it for 3 seconds, then change the stage to "show-leaderboard".
 * Show it for 7 seconds, then check if the game is over by comparing the question number to the total number of questions.
 * If the game is not over, update to the next question number and change the stage to "playing".
 * Else, change the stage to "game-ended".
 */
export async function runLogic(
  roomCode: string,
): Promise<{ gameOver: boolean }> {
  try {
    const gameSession = await getGameSession(roomCode);

    if (!gameSession) {
      throw new GameDoesNotExistError();
    }
    const { room, game } = gameSession;
    const { code } = room;
    const stage = game.stage;

    if (stage === "game-ended") {
      return { gameOver: true };
    }

    await startQuestionCountdown(code);
    await startQuestionEnded(code);
    await startShowLeaderboard(code);
    const gameOver = await isLastQuestion(game, room);
    if (gameOver) {
      await endGame(code);
      return { gameOver: true };
    } else {
      await updateQuestionNumber(game, room);
    }
    return { gameOver: false };
  } catch (error: any) {
    if (error.name === "GamePausedError") {
      return { gameOver: false };
    }
    throw error;
  }
}

/**
 * Start countdown of 20 seconds for the current question.
 * If the current stage was "paused", then resume the countdown from the time it was paused.
 * Otherwise, start the countdown from 20 seconds.
 */
async function startQuestionCountdown(roomCode: string) {
  await new Promise<void>((resolve, reject) => {
    // interval logic
    const interval = setInterval(() => {
      gameDocServer(roomCode)
        .get()
        .then((doc: any) => {
          const newGame = doc.data() as Game;
          if (!newGame) {
            reject(new GameDoesNotExistError());
            clearInterval(interval);
            return;
          }
          const currentStage = newGame.stage;

          if (currentStage === "paused") {
            clearInterval(interval);
            reject(new GamePausedError());
            return;
          }
          countersDocServer(roomCode)
            .get()
            .then((doc: any) => {
              const counters = doc.data() as Counters;
              if (!counters) {
                reject(new CountersDoNotExistError());
                clearInterval(interval);
                return;
              }
              let questionTimer =
                !counters.currentQuestion || counters.currentQuestion <= 0
                  ? CURRENT_QUESTION_TIME
                  : counters.currentQuestion;
              // FOR NEXT DESIGN THE REST OF THE SCREENS AND SET THE LOGIC TO WORK WITH THEM (STAGE)

              questionTimer -= 1;

              if (questionTimer < 0) {
                resolve();
              }
              const newCounters: Counters = {
                ...counters,
                currentQuestion: questionTimer,
              };

              countersDocServer(roomCode)
                .update(newCounters, { merge: true })
                .catch((error: any) => {
                  clearInterval(interval);
                  reject(error);
                });

              if (questionTimer <= 0) {
                clearInterval(interval);
                resolve();
              }
            })
            .catch((error: any) => {
              clearInterval(interval);
              reject(error);
            });
        })
        .catch((error: any) => {
          clearInterval(interval);
          reject(error);
        });
    }, 1000);
  });
}

/**
 * Change the state to "question-ended".
 * Update questionEnded to 3 and start the countdown with an interval of 1 second.
 */
async function startQuestionEnded(code: string) {
  let currentTime = QUESTION_ENDED_TIME;
  const game: Partial<Game> = {
    stage: "question-ended",
  };

  const counters: Partial<Counters> = {
    questionEnded: currentTime,
  };

  const initUpdates: Promise<any>[] = [
    gameDocServer(code).update(game, { merge: true }),
    await countersDocServer(code).update(counters, { merge: true }),
  ];

  await Promise.all(initUpdates);

  await new Promise<void>((resolve, reject) => {
    const interval = setInterval(() => {
      countersDocServer(code)
        .get()
        .then((doc: any) => {
          const countersData = doc.data() as Counters;
          if (!countersData) {
            clearInterval(interval);
            reject(new CountersDoNotExistError());
            return;
          }

          currentTime = countersData.questionEnded || QUESTION_ENDED_TIME;
          currentTime -= 1;

          // current time is minimum between currentTime and QUESTION_ENDED_TIME, and above 0
          currentTime = Math.max(0, Math.min(currentTime, QUESTION_ENDED_TIME));
          if (currentTime <= 0) {
            resolve();
          }

          const newCounters: Counters = {
            ...countersData,
            questionEnded: currentTime,
          };

          countersDocServer(code)
            .update(newCounters, { merge: true })
            .catch((error: any) => {
              clearInterval(interval);
              reject(error);
            })
            .then(() => {
              if (currentTime <= 0) {
                clearInterval(interval);
                resolve();
              }
            });
        })
        .catch((error: any) => {
          clearInterval(interval);
          reject(error);
        });
    }, 1000);
  });
}

/**
 * Change the state to "show-leaderboard".
 * Update showLeaderboard to 7 and start the countdown with an interval of 1 second.
 */
async function startShowLeaderboard(code: string) {
  let currentTime = SHOW_LEADERBOARD_TIME;
  const game: Partial<Game> = {
    stage: "show-leaderboard",
  };
  const counters: Partial<Counters> = {
    showLeaderboard: currentTime,
  };

  const initUpdates: Promise<any>[] = [
    gameDocServer(code).update(game, { merge: true }),
    countersDocServer(code).update(counters, { merge: true }),
  ];

  await Promise.all(initUpdates);

  await new Promise<void>((resolve, reject) => {
    const interval = setInterval(() => {
      currentTime -= 1;

      if (currentTime < 0) {
        resolve();
      }
      const newCounters: Partial<Counters> = {
        showLeaderboard: currentTime,
      };

      countersDocServer(code)
        .update(newCounters, { merge: true })
        .catch((error: any) => {
          clearInterval(interval);
          reject(error);
        })
        .catch((error: any) => {
          clearInterval(interval);
          reject(error);
        })
        .then(() => {
          if (currentTime <= 0) {
            clearInterval(interval);
            resolve();
          }
        });
    }, 1000);
  });
}

/**
 * Check if the game is over by comparing the current question number to the total number of questions.
 *
 * MUST BE CALLED BEFORE updateQuestionNumber.
 */
async function isLastQuestion(game: Game, room: Room): Promise<boolean> {
  const currentQuestionId = game.currentQuestion?.id;
  const totalQuestions = room.questions.length;
  const questionIndex = room.questions.findIndex(
    question => question.id === currentQuestionId,
  );
  if (questionIndex === -1) {
    throw new Error("Question not found");
  }
  return questionIndex === totalQuestions - 1;
}

/**
 * End the game.
 * Change the state to "game-ended".
 */
async function endGame(code: string) {
  const game: Partial<Game> = {
    stage: "game-ended",
  };
  await gameDocServer(code).update(game, { merge: true });
}

async function updateQuestionNumber(game: Game, room: Room) {
  const currentQuestionId = game.currentQuestion?.id;
  const questionIndex = room.questions.findIndex(
    question => question.id === currentQuestionId,
  );

  if (questionIndex === -1) {
    throw new Error("Question not found");
  }

  const nextQuestionIndex = questionIndex + 1;
  const nextQuestion = room.questions[nextQuestionIndex];

  const newGame: Partial<Game> = {
    currentQuestion: nextQuestion,
    stage: "playing",
  };

  await gameDocServer(room.code).update(newGame, { merge: true });
}
