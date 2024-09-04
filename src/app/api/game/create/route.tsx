import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Logger from "@/loggerServer";
import { authOptions } from "@/auth/authOptions";
import crypto from "crypto";
import prisma from "@/app/api/_db/db";
import { CreateRoom } from "@/models/room";
import { Difficulty } from "@/models/question";
import {
  gameDocServer,
  gameSessionDocServer,
  participantsColServer,
  roomDocServer,
} from "@/app/api/_db/firestoreServer";
import { GameSession } from "@/models/game";
import { DbGameSession } from "../../../../lib/utils/firestore";

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

    const gameSession: DbGameSession = {
      session: {
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
      },
      participants: {},
      code: code,
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

    gameSession.session.room.questions = randomOrderQuestions.map(
      ({ id, question, options, difficulty }) => ({
        id,
        question,
        options: options.map(({ option, isCorrect: correct, position }) => ({
          questionId: id,
          option,
          correct,
          position,
        })),
        difficulty: difficulty as Difficulty,
      }),
    );

    // Need to match converter
    await gameSessionDocServer(code).set({
      game: {},
      room: {
        code,
      },
    });
    await roomDocServer(code).set(gameSession.session.room);
    await gameDocServer(code).set(gameSession.session.game);
    await participantsColServer(code);

    const participants =
      Object.keys(gameSession.participants).length > 0
        ? Object.values(gameSession.participants)
        : [];

    const gameSessionData: GameSession = {
      game: {
        ...gameSession.session.game,
        participants,
      },
      room: gameSession.session.room,
      participants,
    };

    // WHEN CREATING THE SESSION IS NOT CREATED AS A COLLECTION, BUT AS PART OF THE OBJECT.
    // TOMORROW MAKE SURE IT'S CREATED AS A COLLECTION.
    return NextResponse.json(gameSessionData, { status: 200 });
  } catch (error: any) {
    Logger.error("Error creating a room", user?.userId || "unknown", {
      error,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
