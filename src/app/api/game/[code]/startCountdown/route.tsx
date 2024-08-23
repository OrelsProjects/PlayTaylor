import { NextRequest, NextResponse } from "next/server";
import Logger from "@/loggerServer";
import { db } from "@/../firebase.config.admin";
import { roomConverter } from "../roomConverter";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth/authOptions";
import { isOwnerOfRoom } from "../_utils";

// This function couts down from 4 to 0 and every second updates the room's countdownStartedAt
const startCountdown = async (code: string): Promise<void> => {
  return new Promise<void>(resolve => {
    const database = db();
    const roomRef = database
      .collection("rooms")
      .doc(code)
      .withConverter(roomConverter);

    let countdown = 4;
    roomRef
      .update({
        countdownStartedAt: Date.now(),
        countdownCurrentTime: countdown,
        stage: "countdown",
      })
      .catch(error => {
        Logger.error("Firestore update failed", "unknown", { error });
        resolve(); // Resolve to avoid hanging the promise
      });

    const interval = setInterval(() => {
      countdown -= 1;
      roomRef
        .update({
          countdownCurrentTime: countdown,
        })
        .catch(error => {
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
    const database = db();
    const roomRef = database
      .collection("rooms")
      .doc(params.code)
      .withConverter(roomConverter);

    const isOwner = isOwnerOfRoom(user.userId, params.code, roomRef);
    if (!isOwner) {
      return NextResponse.json(
        { error: "You are not authorized to start the countdown" },
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
        { error: "You are notauthorized to start the countdown" },
        { status: 401 },
      );
    } else {
      await startCountdown(params.code);
    }

    return NextResponse.json(roomData, { status: 200 });
  } catch (error: any) {
    Logger.error("Error in finding the room", "unknown", {
      error,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
