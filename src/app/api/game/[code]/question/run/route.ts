import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/auth/authOptions";
import { isOwnerOfRoom } from "../../_utils";
import { roomConverter } from "../../roomConverter";
import { db } from "@/../firebase.config.admin";
import { runLogic } from "./questionLogic";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(
  req: NextRequest,
  { params }: { params: { code: string } },
): Promise<Response> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { user } = session;

    const database = db();
    const roomRef = database
      .collection("rooms")
      .doc(params.code)
      .withConverter(roomConverter);

    const isOwner = await isOwnerOfRoom(user.userId, params.code, roomRef);
    if (!isOwner) {
      return NextResponse.json(
        { error: "You are not authorized to resume the game" },
        { status: 401 },
      );
    }

    await runLogic(params.code);

    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
