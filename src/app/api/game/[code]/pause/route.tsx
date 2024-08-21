import { NextRequest, NextResponse } from "next/server";
import Logger from "@/loggerServer";
import { db } from "@/../firebase.config.admin";
import { roomConverter } from "../roomConverter";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth/authOptions";

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
    const database = db();
    const roomRef = database
      .collection("rooms")
      .doc(params.code)
      .withConverter(roomConverter);
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
      await roomRef.update({
        stage: "paused",
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
