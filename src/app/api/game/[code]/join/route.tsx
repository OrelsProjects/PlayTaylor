import { NextRequest, NextResponse } from "next/server";
import Logger from "@/loggerServer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authOptions";
import { Participant } from "@/models/game";
import {
  getGameSession,
  participantDocServer,
  participantsColServer,
} from "@/app/api/_db/firestoreServer";
import { albumNamesArray } from "@/lib/utils/albumsPictures";

const morId = "116646143832605206671";
const morAlbum = "evermore";

const orelId = "115424106856837030343";
const orelAlbum = "ttpd";

export async function POST(
  req: NextRequest,
  { params }: { params: { code: string } },
): Promise<any> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { name } = await req.json();

    const gameSession = await getGameSession(params.code);

    if (!gameSession) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const participants = gameSession.participants || [];
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
        await participantDocServer(
          params.code,
          existingParticipant.userId,
        ).update(
          {
            leftAt: null,
          },
          { merge: true },
        );
        newParticipant = existingParticipant;
      }
    } else {
      // New participant

      const usedAlbums = participants.map((p: any) => p.albumSelected);
      let availableAlbums = albumNamesArray.filter(
        album => !usedAlbums.includes(album),
      );

      if (session.user.userId === morId) {
        if (availableAlbums.includes(morAlbum)) {
          availableAlbums = [morAlbum];
        }
      } else if (session.user.userId === orelId) {
        if (availableAlbums.includes(orelAlbum)) {
          availableAlbums = [orelAlbum];
        }
      }

      const albumSelected =
        availableAlbums[Math.floor(Math.random() * availableAlbums.length)];

      const { userId } = session.user;
      const timestamp = Date.now();

      newParticipant = {
        name,
        questionResponses: [],
        joinedAt: timestamp,
        userId,
        leftAt: null,
        albumSelected,
      };

      await participantsColServer(params.code).doc(userId).set(newParticipant);
    }

    return NextResponse.json(newParticipant, { status: 200 });
  } catch (error: any) {
    Logger.error("Error joining to room", session.user.userId, { error });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
