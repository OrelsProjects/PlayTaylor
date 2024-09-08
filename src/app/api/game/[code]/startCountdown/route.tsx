import { NextRequest, NextResponse } from "next/server";
import Logger from "@/loggerServer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authOptions";
import { isOwnerOfRoom } from "../_utils";
import { Counters, Game, START_GAME_COUNTDOWN } from "@/models/game";
import {
  countersDocServer,
  gameDocServer,
} from "@/app/api/_db/firestoreServer";

// This function couts down from 4 to 0 and every second updates the room's countdownStartedAt
const startCountdown = async (code: string): Promise<void> => {
  try {
    const gameRef = gameDocServer(code);
    const countersRef = countersDocServer(code);
    const now = Date.now();
    let countdown = START_GAME_COUNTDOWN;
    const game: Partial<Game> = {
      countdownStartedAt: now,
      stage: "countdown",
      gameStartedAt: now,
    };
    await gameRef.update(game, { merge: true });

    return new Promise<void>((resolve, reject) => {
      const interval = setInterval(() => {
        countdown -= 1;
        const counters: Partial<Counters> = {
          startGame: countdown,
        };
        countersRef.update(counters, { merge: true }).catch((error: any) => {
          Logger.error("Firestore update failed", "unknown", { error });
          clearInterval(interval);
          reject(error);
        });

        if (countdown <= 0) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
  } catch (error: any) {
    Logger.error("Error in starting the countdown", "unknown", {
      error,
    });
    throw error;
  }
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
    const isOwner = await isOwnerOfRoom(user.userId, params.code);
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
