import { db } from "@/../firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";
import {
  countersConverter,
  gameConverter,
  gameSessionConverter,
  participantConverter,
  roomConverter,
} from "./converters";
import { Counters, Game, Participant } from "@/models/game";

export const gameSessionCollectionClient = db
  ? collection(db, "gameSessions")
  : null;

export const gameSessionDocClient = (code: string) =>
  db ? doc(db, "gameSessions", code).withConverter(gameSessionConverter) : null;

export const roomDocClient = (code: string) =>
  db
    ? doc(db, "gameSessions", code, "session", "room").withConverter(
        roomConverter,
      )
    : null;

export const gameDocClient = (code: string): DocumentReference<Game> | null =>
  db
    ? doc(db, "gameSessions", code, "session", "game").withConverter(
        gameConverter,
      )
    : null;

export const countersDocClient = (
  code: string,
): DocumentReference<Counters> | null =>
  db
    ? doc(db, "gameSessions", code, "session", "counters").withConverter(
        countersConverter,
      )
    : null;

export const participantsColClient = (code: string) =>
  db
    ? collection(db, "gameSessions", code, "participants").withConverter(
        participantConverter,
      )
    : null;

export const participantDocClient = (code: string, userId: string) => {
  return db
    ? doc(db, "gameSessions", code, "participants", userId).withConverter(
        participantConverter,
      )
    : null;
};
