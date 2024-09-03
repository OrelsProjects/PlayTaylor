import { db } from "@/../firebase.config.admin";
import {
  getGameSessionCollection,
  getGameSessionDoc,
  getParticipantDoc,
  getParticipantsCol,
  getRoomDoc,
} from "@/lib/utils/firestore";

export const gameSessionCollectionServer = getGameSessionCollection(db);

export const gameSessionDocServer = (code: string) =>
  getGameSessionDoc(db, code);

export const roomDocServer = (code: string) => getRoomDoc(db, code);

export const gameDocServer = (code: string) => getGameSessionDoc(db, code);

export const participantsColServer = (code: string) =>
  getParticipantsCol(db, code);

export const participantDocServer = (code: string, userId: string) =>
  getParticipantDoc(db, code, userId);
