import { NextRequest, NextResponse } from "next/server";
import Logger from "@/loggerServer";
import { participantDocServer } from "@/app/api/_db/firestoreServer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authOptions";

export async function POST(
  req: NextRequest,
  { params }: { params: { code: string } },
): Promise<any> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { userId } = session.user;
    const participant = (
      await participantDocServer(params.code, userId).get()
    ).data();

    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 },
      );
    }

    await participantDocServer(params.code, userId).update({
      leftAt: new Date(),
    });

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    Logger.error("Error handling POST request", "POST Room Participant", {
      error,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
