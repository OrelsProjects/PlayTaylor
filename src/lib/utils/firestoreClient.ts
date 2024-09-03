import { db } from "@/../firebase.config";
import { collection, doc } from "firebase/firestore";
import {
  gameConverter,
  gameSessionConverter,
  manyParticipantsConverter,
  participantConverter,
  roomConverter,
} from "./roomConverter";

export const gameSessionCollectionClient = db
  ? collection(db, "gameSessions")
  : null;

export const gameSessionDocClient = (code: string) =>
  db && code
    ? doc(db, "gameSessions", code).withConverter(gameSessionConverter)
    : null;

export const roomDocClient = (code: string) =>
  db && code
    ? doc(db, "gameSessions", code, "session", "room").withConverter(
        roomConverter,
      )
    : null;

export const gameDocClient = (code: string) =>
  db && code
    ? doc(db, "gameSessions", code, "session", "game").withConverter(
        gameConverter,
      )
    : null;

export const participantsColClient = (code: string) =>
  db && code
    ? collection(db, "gameSessions", code, "participants").withConverter(
        manyParticipantsConverter,
      )
    : null;

export const participantDocClient = (code: string, userId: string) => {
  return db && code
    ? doc(db, "gameSessions", code, "participants", userId).withConverter(
        participantConverter,
      )
    : null;
};
