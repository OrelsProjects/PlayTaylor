import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Logger from "@/loggerServer";
import { authOptions } from "@/auth/authOptions";
import crypto from "crypto";
import prisma from "@/app/api/_db/db";
import { CreateRoom } from "@/models/room";
import {
  countersDocServer,
  gameDocServer,
  gameSessionDocServer,
  participantsColServer,
  roomDocServer,
} from "@/app/api/_db/firestoreServer";
import {
  CURRENT_QUESTION_TIME,
  GameSession,
  QUESTION_ENDED_TIME,
  SHOW_LEADERBOARD_TIME,
  START_GAME_COUNTDOWN,
} from "@/models/game";
import { Difficulty } from "@/models/question";

export async function POST(
  req: NextRequest,
): Promise<NextResponse<GameSession | { error: string }>> {
  const session = await getServerSession(authOptions); // Ensure you pass `req` to `getServerSession` if needed.
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let user = session.user;
  try {
    const createRoom: CreateRoom = await req.json();
    if (!createRoom) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const code = crypto
      .randomBytes(6)
      .toString("hex")
      .substring(0, 6)
      .toLocaleUpperCase();

    const gameSession: GameSession = {
      room: {
        code: code,
        name: createRoom.name,
        createdBy: user.userId,
        createdAt: Date.now(),
        questionsCount: createRoom.questionsCount,
        participantsCount: createRoom.participantsCount,
        difficulty: createRoom.difficulty,
        questions: [],
      },
      game: {
        stage: "lobby",
      },
      counters: {
        currentQuestion: CURRENT_QUESTION_TIME,
        questionEnded: QUESTION_ENDED_TIME,
        showLeaderboard: SHOW_LEADERBOARD_TIME,
        startGame: START_GAME_COUNTDOWN,
      },
      participants: [],
    };

    const questions = await prisma.question.findMany({
      where: {
        difficulty: createRoom.difficulty,
      },
      include: {
        options: true,
      },
    });

    const randomOrderQuestions = questions
      .sort(() => Math.random() - 0.5)
      .slice(0, createRoom.questionsCount);

    gameSession.room.questions = randomOrderQuestions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options.map(o => ({
        questionId: q.id,
        option: o.option,
        correct: o.isCorrect,
        position: o.position,
      })),
      difficulty: q.difficulty as Difficulty,
    }));

    // Need to match converter
    await gameSessionDocServer(code).set({});
    await roomDocServer(code).set(gameSession.room);
    await gameDocServer(code).set(gameSession.game);
    await countersDocServer(code).set(gameSession.counters);
    await participantsColServer(code);

    return NextResponse.json(gameSession, { status: 200 });
  } catch (error: any) {
    Logger.error("Error creating a room", user?.userId || "unknown", {
      error,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
