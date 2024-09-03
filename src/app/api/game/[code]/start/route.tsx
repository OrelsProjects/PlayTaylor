import { NextRequest, NextResponse } from "next/server";
import Logger from "@/loggerServer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authOptions";
import { isOwnerOfRoom } from "../_utils";
import { gameDocServer, roomDocServer } from "@/app/api/_db/firestoreServer";

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
    const gameRef = gameDocServer(params.code);
    const roomRef = roomDocServer(params.code);

    const isOwner = isOwnerOfRoom(user.userId, params.code);
    if (!isOwner) {
      return NextResponse.json(
        { error: "You are not authorized to start the game" },
        { status: 401 },
      );
    }

    const roomSnapshot = await roomRef.get();
    const roomData = roomSnapshot.data();

    if (!roomData) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const creator = roomData.createdBy;

    if (user.userId !== creator) {
      return NextResponse.json(
        { error: "You are notauthorized to start the game" },
        { status: 401 },
      );
    } else {
      const timestamp = Date.now();
      const question = roomData.questions[0];
      await gameRef.update({
        gameStartedAt: timestamp,
        currentQuestion: question,
        stage: "playing",
      });
    }

    return NextResponse.json(roomData, { status: 200 });
  } catch (error: any) {
    Logger.error("Error in finding the room", "unknown", {
      error,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
