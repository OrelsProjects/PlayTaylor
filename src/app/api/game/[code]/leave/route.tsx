import { NextRequest, NextResponse } from "next/server";
import Logger from "../../../../../loggerServer";
import { db } from "../../../../../../firebase.config.admin";

export async function POST(
  req: NextRequest,
  { params }: { params: { code: string } },
): Promise<any> {
  try {
    const { name } = await req.json();

    const database = db();
    const roomRef = database.collection("rooms").doc(params.code);
    const roomSnapshot = await roomRef.get();

    if (!roomSnapshot.exists) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    let roomData = roomSnapshot.data();

    if (!roomData || !roomData.participants) {
      return NextResponse.json(
        { error: "No participants in the room" },
        { status: 404 },
      );
    }

    let participants = roomData.participants;
    const timestamp = Date.now();
    const participantIndex = participants.findIndex(
      (p: any) => p.name === name,
    );

    if (participantIndex === -1) {
      return NextResponse.json(
        { error: "Participant is not in the room" },
        { status: 400 },
      );
    }

    // Update the participant's leftAt time
    participants[participantIndex].leftAt = timestamp;

    // Update the participants array in Firestore
    await roomRef.update({
      participants: participants,
    });

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    Logger.error("Error handling POST request", "POST Room Participant", {
      error,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
