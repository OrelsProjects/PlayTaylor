import { NextRequest, NextResponse } from "next/server";
import Logger from "@/loggerServer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authOptions";
import { gameDocServer, gameSessionDocServer } from "../../../_db/firestoreServer";

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
    const gameData = (await gameSessionDocServer(params.code).get()).data();

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
      await gameDocServer(params.code).update({
        stage: "paused",
      });
    }

    return NextResponse.json(gameData, { status: 200 });
  } catch (error: any) {
    Logger.error("Error in finding the room", "unknown", {
      error,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
