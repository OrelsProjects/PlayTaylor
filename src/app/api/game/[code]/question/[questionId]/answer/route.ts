import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import loggerServer from "@/loggerServer";
import { authOptions } from "@/auth/authOptions";
import { db } from "@/../firebase.config.admin";
import { QuestionResponse } from "@/models/question";
import { roomConverter } from "../../../roomConverter";
import { AnsweredTooLateError } from "@/models/errors/AnsweredTooLateError";

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      code: string;
      questionId: string;
    };
  },
) {
  const session = await getServerSession(authOptions);
  try {
    const {
      response,
      participantName,
    }: { response: QuestionResponse; participantName: string } =
      await req.json();
    const database = db();
    const roomRef = database
      .collection("rooms")
      .doc(params.code)
      .withConverter(roomConverter);
    const roomSnapshot = await roomRef.get();
    const room = roomSnapshot.data();
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // if (room.stage !== "playing") {
    //   return NextResponse.json(
    //     { error: AnsweredTooLateError },
    //     { status: 400 },
    //   );
    // }

    const { participants } = room;

    const participantIndex = participants.findIndex(
      (p: any) => p.name === participantName,
    );

    if (participantIndex === -1) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 },
      );
    }
// So in order to avoid race to the same resource(participants in rooms), we need to avoid updating the whole participants array in the room document. Instead, we should update only the participant that we want to update.
// To do this, we need to:
// 1. Find the participant in the participants array.
// 2. Update the participant in the participants array.
// 3. Update the room document with the updated participants array.
// So, we need to create a collection for each participant in the room/participants array.
// This way, we can update the participant without updating the whole participants array.
    participants[participantIndex].questionResponses?.push(response);

    // update participant in index participantIndex
    await roomRef.update({ participants });
  } catch (error: any) {
    loggerServer.error(
      "Error in finding the room",
      session?.user.userId || "unknown",
      {
        error,
      },
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
