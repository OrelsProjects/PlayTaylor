import { NextRequest, NextResponse } from "next/server";
import questions from "./questions.json";
import prisma from "../../_db/db";
import { numberToDifficulty } from "@/models/question";

export async function GET(req: NextRequest) {
  //   for (const question of questions.questions) {
  //     const { options } = question;

  //     const newQuestion = await prisma.question.create({
  //       data: {
  //         question: question.question,
  //         difficulty: numberToDifficulty[question.difficulty as 1 | 2 | 3],
  //       },
  //     });

  //     const createOptionsPromises = options.map(async option => {
  //       await prisma.questionOption.create({
  //         data: {
  //           option: option.option,
  //           questionId: newQuestion.id,
  //           position: option.position,
  //           isCorrect: option.correct,
  //         },
  //       });
  //     });

  //     await Promise.all(createOptionsPromises);
  //   }
  return NextResponse.json(questions, { status: 200 });
}
