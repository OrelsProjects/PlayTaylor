import { db } from "@/../firebase.config";
import { collection, doc, DocumentReference } from "firebase/firestore";
import {
  gameConverter,
  gameSessionConverter,
  participantConverter,
  roomConverter,
} from "./converters";
import { Game } from "@/models/game";

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

export const gameDocClient = (code: string): DocumentReference<Game> | null =>
  db && code
    ? doc(db, "gameSessions", code, "session", "game").withConverter(
        gameConverter,
      )
    : null;

export const participantsColClient = (code: string) =>
  db && code
    ? collection(db, "gameSessions", code, "participants").withConverter(
        participantConverter,
      )
    : null;

export const participantDocClient = (code: string, userId: string) => {
  return db && code
    ? doc(db, "gameSessions", code, "participants", userId).withConverter(
        participantConverter,
      )
    : null;
};
