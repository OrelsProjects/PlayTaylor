import { db } from "@/../firebase.config.admin";
import {
  getCountersDoc,
  getGameDoc,
  getGameSessionCollection,
  getGameSessionDoc,
  getParticipantDoc,
  getParticipantsCol,
  getRoomDoc,
} from "@/lib/utils/firestore";
import { Game, GameSession, Participant } from "@/models/game";
import Room from "@/models/room";

export const gameSessionCollectionServer = getGameSessionCollection(db);

export const gameSessionDocServer = (code: string, withConverter?: boolean) =>
  getGameSessionDoc(db, code, withConverter);

export const roomDocServer = (code: string) => getRoomDoc(db, code);

export const gameDocServer = (code: string) => getGameDoc(db, code);

export const countersDocServer = (code: string) => getCountersDoc(db, code);

export const participantsColServer = (code: string, withConverter?: boolean) =>
  getParticipantsCol(db, code, withConverter);

export const participantDocServer = (code: string, userId: string) =>
  getParticipantDoc(db, code, userId);

export const getGameSession = async (code: string): Promise<GameSession> => {
  const room: Room = (await roomDocServer(code).get()).data();
  const game: Game = (await gameDocServer(code).get()).data();
  const participantsSnapshot = await participantsColServer(code, true).get();
  const counters = (await countersDocServer(code).get()).data();
  const participants: Participant[] = [];

  participantsSnapshot.forEach((participantDoc: any) => {
    participants.push(participantDoc.data());
  });

  return {
    room,
    game,
    participants,
    counters,
  };
};
