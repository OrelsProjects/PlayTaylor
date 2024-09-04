import { NextRequest, NextResponse } from "next/server";
import Logger from "@/loggerServer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authOptions";
import { isOwnerOfRoom } from "../_utils";
import { getGameDoc } from "@/lib/utils/firestore";
import { db } from "@/../firebase.config.admin";

// This function couts down from 4 to 0 and every second updates the room's countdownStartedAt
const startCountdown = async (code: string): Promise<void> => {
  return new Promise<void>(resolve => {
    const gameRef = getGameDoc(db, code);

    let countdown = 4;
    gameRef
      .update(
        {
          countdownStartedAt: Date.now(),
          countdownCurrentTime: countdown,
          stage: "countdown",
        },
        { merge: true },
      )
      .catch((error: any) => {
        Logger.error("Firestore update failed", "unknown", { error });
        resolve(); // Resolve to avoid hanging the promise
      });

    const interval = setInterval(() => {
      countdown -= 1;
      gameRef
        .update(
          {
            countdownCurrentTime: countdown,
          },
          { merge: true },
        )
        .catch((error: any) => {
          Logger.error("Firestore update failed", "unknown", { error });
          clearInterval(interval);
          resolve(); // Resolve to avoid hanging the promise
        });

      if (countdown === 0) {
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  });
};

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
        { error: "You are not authorized to start the countdown" },
        { status: 401 },
      );
    }

    await startCountdown(params.code);

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    Logger.error("Error in finding the room", "unknown", {
      error,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
