import { NextRequest, NextResponse } from "next/server";
import Logger from "@/loggerServer";
import {
  gameDocServer,
  gameSessionDocServer,
  getGameSession,
  participantsColServer,
  roomDocServer,
} from "@/app/api/_db/firestoreServer";
import { Game, GameSession } from "@/models/game";
import Room from "@/models/room";

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } },
): Promise<NextResponse<GameSession | { error: string }>> {
  try {
    const { room, game, participants } = await getGameSession(params.code);
    
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const gameSession: GameSession = {
      room,
      game,
      participants,
    };

    return NextResponse.json(gameSession, { status: 200 });
  } catch (error: any) {
    Logger.error("Error in finding the room", "unknown", {
      error,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
