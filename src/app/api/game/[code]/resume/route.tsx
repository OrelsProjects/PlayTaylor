import { NextRequest, NextResponse } from "next/server";
import Logger from "@/loggerServer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authOptions";
import { isOwnerOfRoom } from "../_utils";
import { runLogic } from "../question/run/questionLogic";
import { gameDocServer } from "@/app/api/_db/firestoreServer";

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
    const isOwner = isOwnerOfRoom(user.userId, params.code);
    if (!isOwner) {
      return NextResponse.json(
        { error: "You are not authorized to resume the game" },
        { status: 401 },
      );
    }

    const gameRef = gameDocServer(params.code);

    const roomSnapshot = await gameRef.get();
    const roomData = roomSnapshot.data();

    if (!roomData) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    await gameRef.update(
      {
        stage: "playing",
      },
      { merge: true },
    );
    runLogic(params.code);

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    Logger.error("Error in finding the room", "unknown", {
      error,
    });
    if (error.name === "RoomDoesNotExistError") {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
