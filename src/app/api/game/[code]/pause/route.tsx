import { NextRequest, NextResponse } from "next/server";
import Logger from "@/loggerServer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authOptions";
import { gameDocServer, getGameSession } from "@/app/api/_db/firestoreServer";
import { CURRENT_QUESTION_TIME } from "@/models/game";

export async function POST(
  req: NextRequest,
  { params }: { params: { code: string } },
): Promise<any> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { user } = session;
  try {
    const gameData = await getGameSession(params.code);
    const { pausedAt }: { pausedAt: number } = await req.json();

    if (!gameData) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const creator = gameData.room.createdBy;

    if (user.userId !== creator) {
      return NextResponse.json(
        { error: "You are notauthorized to start the game" },
        { status: 401 },
      );
    } else {
      const now = Date.now();

      let secondsPassed = (now - pausedAt) / 1000;
      if (secondsPassed < 1) {
        secondsPassed = 0;
      } else {
        secondsPassed = Math.floor(secondsPassed);
      }
      let timeLeft =
        gameData.counters.currentQuestion === undefined
          ? CURRENT_QUESTION_TIME
          : gameData.counters.currentQuestion;

      timeLeft += secondsPassed;

      // time left min 0 max CURRENT_QUESTION_TIME
      timeLeft = Math.min(CURRENT_QUESTION_TIME, Math.max(0, timeLeft || 0));

      await gameDocServer(params.code).update(
        {
          stage: "paused",
          currentQuestion: {
            ...gameData.game.currentQuestion,
            timer: timeLeft,
          },
        },
        { merge: true },
      );
    }

    return NextResponse.json(gameData, { status: 200 });
  } catch (error: any) {
    Logger.error("Error in finding the room", "unknown", {
      error,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
