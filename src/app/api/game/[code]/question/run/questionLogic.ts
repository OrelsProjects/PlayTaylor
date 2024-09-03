import { GameDoesNotExistError } from "@/models/errors/RoomDoesNotExistError";
import {
  Game,
  QUESTION_TIME,
  QUESTION_ENDED_TIME,
  SHOW_LEADERBOARD_TIME,
} from "@/models/game";
import { GamePausedError } from "@/models/errors/GamePausedError";
import Room from "@/models/room";
import { gameDocServer, gameSessionDocServer, roomDocServer } from "@/app/api/_db/firestoreServer";

type GameRef = FirebaseFirestore.DocumentReference<Game, any>;

/**
 * Start countdown of 20 seconds.
 * After the 20 seconds is over, change the stage to "question-ended".
 * Show it for 3 seconds, then change the stage to "show-leaderboard".
 * Show it for 7 seconds, then check if the game is over by comparing the question number to the total number of questions.
 * If the game is not over, update to the next question number and change the stage to "playing".
 * Else, change the stage to "game-ended".
 */
export async function runLogic(roomCode: string) {
  try {
    const gameSession = (await gameSessionDocServer(roomCode).get()).data();
    if (!gameSession) {
      throw new GameDoesNotExistError();
    }
    const gameRef = gameDocServer(roomCode);
    const { room, game } = gameSession;

    await startQuestionCountdown(gameRef);
    await startQuestionEnded(gameRef);
    await startShowLeaderboard(gameRef, game);
    const gameOver = await isLastQuestion(game, room);
    if (gameOver) {
      await endGame(gameRef);
    } else {
      await updateQuestionNumber(gameRef, game, room);
    }
  } catch (error: any) {
    if (error.name === "GamePausedError") {
      return;
    }
    throw error;
  }
}

/**
 * Start countdown of 20 seconds for the current question.
 * If the current stage was "paused", then resume the countdown from the time it was paused.
 * Otherwise, start the countdown from 20 seconds.
 */
async function startQuestionCountdown(gameRef: GameRef) {
  await new Promise<void>((resolve, reject) => {
    // interval logic
    const interval = setInterval(() => {
      gameRef.get().then(gameData => {
        const game = gameData.data();
        if (!game) {
          reject(new GameDoesNotExistError());
          clearInterval(interval);
          return;
        }
        const currentStage = game.stage;

        let questionTimer = game.currentQuestion.timer || QUESTION_TIME;
        // FOR NEXT DESIGN THE REST OF THE SCREENS AND SET THE LOGIC TO WORK WITH THEM (STAGE)
        if (currentStage === "paused") {
          const currentTime = game.currentQuestion.timer;
          questionTimer = currentTime;
          clearInterval(interval);
          reject(new GamePausedError());
          return;
        }

        questionTimer -= 1;
        gameRef
          .update({
            countdownCurrentTime: questionTimer,
          })
          .catch(error => {
            clearInterval(interval);
            reject(error);
          });

        if (questionTimer === 0) {
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
async function startQuestionEnded(gameRef: GameRef) {
  let currentTime = QUESTION_ENDED_TIME - 1;
  await gameRef.update({
    stage: "question-ended",
    countdownQuestionEnded: currentTime,
  });

  await new Promise<void>((resolve, reject) => {
    const interval = setInterval(() => {
      gameRef
        .update({
          countdownQuestionEnded: currentTime,
        })
        .catch(error => {
          clearInterval(interval);
          reject(error);
        });

      currentTime = currentTime - 1;

      if (currentTime < 0) {
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  });
}

/**
 * Change the state to "show-leaderboard".
 * Update countdownShowLeaderboard to 7 and start the countdown with an interval of 1 second.
 */
async function startShowLeaderboard(gameRef: GameRef, game: Game) {
  let currentTime = SHOW_LEADERBOARD_TIME - 1;
  await gameRef.update({
    stage: "show-leaderboard",
    countdownShowLeaderboard: currentTime,
  });

  await new Promise<void>((resolve, reject) => {
    const interval = setInterval(() => {
      gameRef
        .update({
          countdownShowLeaderboard: currentTime,
        })
        .catch(error => {
          clearInterval(interval);
          reject(error);
        });
      currentTime = currentTime - 1;
      if (currentTime === 0) {
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  });
}

/**
 * Check if the game is over by comparing the current question number to the total number of questions.
 *
 * MUST BE CALLED BEFORE updateQuestionNumber.
 */
async function isLastQuestion(game: Game, room: Room): Promise<boolean> {
  const currentQuestionId = game.currentQuestion.id;
  const totalQuestions = room.questions.length;
  const questionIndex = room.questions.findIndex(
    question => question.id === currentQuestionId,
  );

  return questionIndex === totalQuestions - 1;
}

/**
 * End the game.
 * Change the state to "game-ended".
 */
async function endGame(gameRef: GameRef) {
  await gameRef.update({
    stage: "game-ended",
  });
}

async function updateQuestionNumber(gameRef: GameRef, game: Game, room: Room) {
  const currentQuestionId = game.currentQuestion.id;
  const questionIndex = room.questions.findIndex(
    question => question.id === currentQuestionId,
  );

  const nextQuestionIndex = questionIndex + 1;
  const nextQuestion = room.questions[nextQuestionIndex];

  await gameRef.update({
    currentQuestion: nextQuestion,
    stage: "playing",
  });
}
