import { CURRENT_QUESTION_TIME } from "@/models/game";
import { QuestionOption } from "@/models/question";

const BONUS_TIME_POINTS = 1;

/**
 * Calculate the final score of the participant.
 * The final score is calculated by adding 1 point for each correct answer and
 * adding bonus points for each correct answer that was answered quickly.
 * If answered in less than CURRENT_QUESTION_TIME/2, no bonus points are added.
 */
export const calculateFinalScore = (responses: QuestionOption[]): number =>
  responses.reduce((acc, response) => {
    if (response.correct) {
      acc += 1;
    }
    if (
      response.timeToAnswer &&
      response.timeToAnswer < CURRENT_QUESTION_TIME / 2
    ) {
      acc += BONUS_TIME_POINTS;
    }
    return Math.floor(acc);
  }, 0);
