import { NextRequest, NextResponse } from "next/server";
import Logger from "../../../../loggerServer";
import { db } from "../../../../../firebase.config.admin";

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } },
): Promise<any> {
  try {
    const database = db();
    const roomRef = database.collection("rooms").doc(params.code);
    const roomSnapshot = await roomRef.get();
    const roomData = roomSnapshot.data();

    if (!roomData) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(roomData, { status: 200 });
  } catch (error: any) {
    Logger.error("Error in finding the room", "unknown", {
      error,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<any> {
  // Implement POST functionality if needed
}
