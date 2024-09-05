import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import loggerServer from "@/loggerServer";
import { authOptions } from "@/auth/authOptions";
import {
  getGameSession,
  participantDocServer,
} from "@/app/api/_db/firestoreServer";
import { AnsweredTooLateError } from "@/models/errors/AnsweredTooLateError";
import { QuestionOption } from "@/models/question";

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      code: string;
      questionId: string;
    };
  },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { response }: { response: QuestionOption } = await req.json();
    const gameSession = await getGameSession(params.code);

    if (!gameSession) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const { game, participants } = gameSession;

    if (game.stage !== "playing" && game.stage !== "paused") {
      return NextResponse.json(
        { error: AnsweredTooLateError },
        { status: 400 },
      );
    }

    const participant = participants?.find(
      p => p.userId === session.user.userId,
    );

    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 },
      );
    }

    const questionResponses = participant.questionResponses || [];

    if (questionResponses.some(r => r.questionId === params.questionId)) {
      return NextResponse.json({ error: "Already answered" }, { status: 400 });
    }
    questionResponses.push(response);
    // update participant in index participantIndex
    const participantRef = participantDocServer(
      params.code,
      participant.userId,
    );
    await participantRef.update(
      { ...participant, questionResponses },
      { merge: true },
    );

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    loggerServer.error(
      "Error in finding the room",
      session?.user.userId || "unknown",
      {
        error,
      },
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
