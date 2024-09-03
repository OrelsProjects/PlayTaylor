import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import loggerServer from "@/loggerServer";
import { authOptions } from "@/auth/authOptions";
import { QuestionResponse } from "@/models/question";
import { gameSessionDocServer, participantDocServer } from "@/app/api/_db/firestoreServer";
import { GameSession } from "@/models/game";
import { AnsweredTooLateError } from "@/models/errors/AnsweredTooLateError";

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
    const { response }: { response: QuestionResponse } = await req.json();
    const gameSessionRef = gameSessionDocServer(params.code);
    const gameSessionSnapshot = await gameSessionRef.get();
    const gameSession: GameSession | undefined = gameSessionSnapshot.data();

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

    const participant = participants.find(
      p => p.userId === session.user.userId,
    );

    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 },
      );
    }

    // update participant in index participantIndex
    const participantRef = participantDocServer(params.code, participant.userId);
    await participantRef.update({ ...participant, response });
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
