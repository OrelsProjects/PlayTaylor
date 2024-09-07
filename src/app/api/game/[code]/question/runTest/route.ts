import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/auth/authOptions";
import { isOwnerOfRoom } from "../../_utils";
import { runLogic } from "./questionLogic";
import { roomDocServer } from "@/app/api/_db/firestoreServer";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(
  req: NextRequest,
  { params }: { params: { code: string } },
): Promise<Response> {
  try {
    const { gameOver } = await runLogic(params.code);

    return NextResponse.json({ gameOver }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
