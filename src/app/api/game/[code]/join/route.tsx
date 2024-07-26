import { NextRequest, NextResponse } from "next/server";
import Logger from "../../../../../loggerServer";
import { db } from "../../../../../../firebase.config.admin";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth/authOptions";
import { Participant } from "../../../../../models/room";

export async function POST(
  req: NextRequest,
  { params }: { params: { code: string } },
): Promise<any> {
  try {
    const session = await getServerSession(authOptions);

    const { name } = await req.json();

    const database = db();
    const roomRef = database.collection("rooms").doc(params.code);
    const roomSnapshot = await roomRef.get();
    const roomData = roomSnapshot.data();

    if (!roomSnapshot.exists || !roomData) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const roomKey = roomSnapshot.id; // The document ID of the room
    const timestamp = Date.now();
    const participants = roomData.participants || [];

    const existingParticipant = participants.find((p: any) => p.name === name);
    let newParticipant: Participant | null = null;

    if (existingParticipant) {
      if (!existingParticipant.leftAt) {
        return NextResponse.json(
          { error: "Participant name taken" },
          { status: 400 },
        );
      } else {
        existingParticipant.leftAt = null;
        await database
          .collection("rooms")
          .doc(roomKey)
          .update({ participants });
        newParticipant = existingParticipant;
      }
    } else {
      const userId: string | null = session?.user?.userId || null;

      newParticipant = {
        name,
        correctAnswers: 0,
        joinedAt: timestamp,
        userId,
        leftAt: null,
      };

      participants.push(newParticipant);
      await database.collection("rooms").doc(roomKey).update({ participants });
    }

    return NextResponse.json(newParticipant, { status: 200 });
  } catch (error: any) {
    Logger.error("Error initializing logger", "unknown", { error });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
