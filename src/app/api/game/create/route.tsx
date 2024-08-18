import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Logger from "@/loggerServer";
import { authOptions } from "@/auth/authOptions";
import { db } from "@/../firebase.config.admin";
import crypto from "crypto";
import prisma from "@/app/api/_db/db";
import { CreateRoom } from "@/models/room";

export async function POST(req: NextRequest): Promise<any> {
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
        type: "swipe",
      },
      take: createRoom.questionsCount,
    });

    const randomOrderQuestions = questions.sort(() => Math.random() - 0.5);

    await roomRef.set({
      name: createRoom.name,
      code,
      participantsCount: createRoom.participantsCount,
      difficulty: createRoom.difficulty,
      participants: [],
      questions: randomOrderQuestions,
      currentQuestion: 0,
      createdBy: user?.userId,
      createdAt: timestamp,
    });

    return NextResponse.json({ code }, { status: 200 });
  } catch (error: any) {
    Logger.error("Error creating a room", user?.userId || "unknown", {
      error,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
