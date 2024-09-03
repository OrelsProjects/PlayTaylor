import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Logger from "@/loggerServer";
import { authOptions } from "@/auth/authOptions";
import { db } from "@/../firebase.config.admin";
import crypto from "crypto";
import prisma from "@/app/api/_db/db";
import { CreateRoom } from "@/models/room";
import { Question } from "@/models/question";

export async function POST(
  req: NextRequest,
): Promise<NextResponse<{ code: string } | { error: string }>> {
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
    const database = db();

    const code = crypto
      .randomBytes(6)
      .toString("hex")
      .substring(0, 6)
      .toLocaleUpperCase();

    // Use the generated code as the document ID
    const roomRef = database.collection("rooms").doc(code);
    const timestamp = Date.now();

    const questions = await prisma.question.findMany({
      where: {
        difficulty: createRoom.difficulty,
      },
      include: {
        options: true,
      },
      take: createRoom.questionsCount,
    });

    const randomOrderQuestions = questions.sort(() => Math.random() - 0.5);

    const newRoom = {
      name: createRoom.name,
      code,
      participantsCount: createRoom.participantsCount,
      difficulty: createRoom.difficulty,
      participants: [],
      questions: randomOrderQuestions,
      currentQuestion: 0,
      createdBy: user?.userId,
      createdAt: timestamp,
    }

    await roomRef.set(newRoom);

    return NextResponse.json({ ...newRoom }, { status: 200 });
  } catch (error: any) {
    Logger.error("Error creating a room", user?.userId || "unknown", {
      error,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
