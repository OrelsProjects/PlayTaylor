import { NextRequest, NextResponse } from "next/server";
import Logger from "@/loggerServer";
import { roomDocServer } from "@/app/api/_db/firestoreServer";

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } },
): Promise<any> {
  try {
    const roomData = (await roomDocServer(params.code).get()).data();

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
