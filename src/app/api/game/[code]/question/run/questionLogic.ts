import { db } from "@/../firebase.config.admin";
import { roomConverter } from "../../roomConverter";
import { RoomDoesNotExistError } from "@/models/errors/RoomDoesNotExistError";
import { Question } from "@prisma/client";
import Room, {
  QUESTION_TIME,
  QUESTION_ENDED_TIME,
  SHOW_LEADERBOARD_TIME,
} from "@/models/room";
import { GamePausedError } from "../../../../../../models/errors/GamePausedError";

type RoomRef =
  FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;

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
    const database = db();
    const roomRef = database
      .collection("rooms")
      .doc(roomCode)
      .withConverter(roomConverter);

    const roomSnapshot = await roomRef.get();
    const roomData = roomSnapshot.data();

    if (!roomData) {
      throw new RoomDoesNotExistError();
    }

    await startQuestionCountdown(roomRef);
    await startQuestionEnded(roomRef);
    await startShowLeaderboard(roomRef, roomData);
    const gameOver = await isGameOver(roomData);
    if (gameOver) {
      await endGame(roomRef);
    } else {
      await updateQuestionNumber(roomRef, roomData);
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
async function startQuestionCountdown(roomRef: RoomRef) {
  await new Promise<void>((resolve, reject) => {
    // interval logic
    const interval = setInterval(() => {
      roomRef.get().then(roomData => {
        const room = roomData.data();
        if (!room) {
          reject(new RoomDoesNotExistError());
          clearInterval(interval);
          return;
        }
        const currentStage = room.stage;

        let questionTimer = room.currentQuestion.timer || QUESTION_TIME;
        // FOR NEXT DESIGN THE REST OF THE SCREENS AND SET THE LOGIC TO WORK WITH THEM (STAGE)
        if (currentStage === "paused") {
          const currentTime = room.currentQuestion.timer;
          questionTimer = currentTime;
          clearInterval(interval);
          reject(new GamePausedError());
          return;
        }

        questionTimer -= 1;
        roomRef
          .update({
            "currentQuestion.timer": questionTimer,
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
async function startQuestionEnded(roomRef: RoomRef) {
  let currentTime = QUESTION_ENDED_TIME - 1;
  await roomRef.update({
    stage: "question-ended",
    countdownQuestionEnded: currentTime,
  });

  await new Promise<void>((resolve, reject) => {
    const interval = setInterval(() => {
      roomRef
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
async function startShowLeaderboard(roomRef: RoomRef, room: Room) {
  let currentTime = SHOW_LEADERBOARD_TIME - 1;
  await roomRef.update({
    stage: "show-leaderboard",
    countdownShowLeaderboard: currentTime,
  });

  await new Promise<void>((resolve, reject) => {
    const interval = setInterval(() => {
      roomRef
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
async function isGameOver(room: Room): Promise<boolean> {
  const currentQuestionId = room.currentQuestion.id;
  const totalQuestions = room.questions.length;
  const questionIndex = room.questions.findIndex(
    (question: Question) => question.id === currentQuestionId,
  );

  return questionIndex === totalQuestions - 1;
}

/**
 * End the game.
 * Change the state to "game-ended".
 */
async function endGame(roomRef: RoomRef) {
  await roomRef.update({
    stage: "game-ended",
  });
}

async function updateQuestionNumber(roomRef: RoomRef, room: Room) {
  const currentQuestionId = room.currentQuestion.id;
  const questionIndex = room.questions.findIndex(
    (question: Question) => question.id === currentQuestionId,
  );

  const nextQuestionIndex = questionIndex + 1;
  const nextQuestion = room.questions[nextQuestionIndex];

  await roomRef.update({
    currentQuestion: nextQuestion,
    stage: "playing",
  });
}
