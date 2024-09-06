import { GameDoesNotExistError } from "@/models/errors/RoomDoesNotExistError";
import {
  Game,
  QUESTION_TIME,
  QUESTION_ENDED_TIME,
  SHOW_LEADERBOARD_TIME,
} from "@/models/game";
import { GamePausedError } from "@/models/errors/GamePausedError";
import Room from "@/models/room";
import { gameDocServer, getGameSession } from "@/app/api/_db/firestoreServer";

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
        .then((gameData: any) => {
          const game = gameData.data();
          if (!game) {
            reject(new GameDoesNotExistError());
            clearInterval(interval);
            return;
          }
          const currentStage = game.stage;

          let questionTimer =
            game.currentQuestion?.timer === undefined
              ? QUESTION_TIME
              : game.currentQuestion.timer;
          // FOR NEXT DESIGN THE REST OF THE SCREENS AND SET THE LOGIC TO WORK WITH THEM (STAGE)
          if (currentStage === "paused") {
            clearInterval(interval);
            reject(new GamePausedError());
            return;
          }

          questionTimer -= 1;

          if (questionTimer < 0) {
            resolve();
          }

          gameDocServer(roomCode)
            .update(
              {
                currentQuestion: {
                  ...game.currentQuestion,
                  timer: questionTimer,
                },
              },
              { merge: true },
            )
            .catch((error: any) => {
              clearInterval(interval);
              reject(error);
            });

          if (questionTimer <= 0) {
            clearInterval(interval);
            resolve();
          }
        });
    }, 1000);
  });
}

/**
 * Change the state to "question-ended".
 * Update countdownQuestionEnded to 3 and start the countdown with an interval of 1 second.
 */
async function startQuestionEnded(code: string) {
  let currentTime = QUESTION_ENDED_TIME;
  await gameDocServer(code).update(
    {
      stage: "question-ended",
      countdownQuestionEnded: currentTime,
    },
    { merge: true },
  );

  await new Promise<void>((resolve, reject) => {
    const interval = setInterval(() => {
      gameDocServer(code)
        .get()
        .then((doc: any) => {
          const gameData = doc.data();
          if (!gameData) {
            clearInterval(interval);
            reject(new GameDoesNotExistError());
            return;
          }

          currentTime = gameData.countdownQuestionEnded;
          currentTime -= 1;

          if (currentTime < 0) {
            resolve();
          }

          gameDocServer(code)
            .update({
              countdownQuestionEnded: currentTime,
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
 * Update countdownShowLeaderboard to 7 and start the countdown with an interval of 1 second.
 */
async function startShowLeaderboard(code: string) {
  let currentTime = SHOW_LEADERBOARD_TIME;
  await gameDocServer(code).update(
    {
      stage: "show-leaderboard",
      countdownShowLeaderboard: currentTime,
    },
    { merge: true },
  );

  await new Promise<void>((resolve, reject) => {
    const interval = setInterval(() => {
      currentTime -= 1;

      if (currentTime < 0) {
        resolve();
      }

      gameDocServer(code)
        .update(
          {
            countdownShowLeaderboard: currentTime,
          },
          { merge: true },
        )
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
  await gameDocServer(code).update(
    {
      stage: "game-ended",
    },
    { merge: true },
  );
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

  await gameDocServer(room.code).update(
    {
      currentQuestion: nextQuestion,
      stage: "playing",
    },
    { merge: true },
  );
}
