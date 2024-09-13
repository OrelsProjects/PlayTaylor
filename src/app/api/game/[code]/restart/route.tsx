import { NextRequest, NextResponse } from "next/server";
import Logger from "@/loggerServer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authOptions";
import { gameDocServer, getGameSession } from "@/app/api/_db/firestoreServer";
import { Game, START_GAME_COUNTDOWN } from "@/models/game";

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
      if (gameData.game.stage !== "game-ended") {
        return NextResponse.json(
          { error: "Game is still ongoing" },
          { status: 400 },
        );
      }

      const newGame: Game = {
        stage: "countdown",
        currentQuestion: undefined,
        
        countdownStartedAt: START_GAME_COUNTDOWN,
      };

      await gameDocServer(params.code).update(newGame, { merge: true });
    }

    return NextResponse.json(gameData, { status: 200 });
  } catch (error: any) {
    Logger.error("Error in finding the room", "unknown", {
      error,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
