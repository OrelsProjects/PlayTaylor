import { Game, UserIdOrName, Participant } from "@/models/game";
import Room from "@/models/room";
import {
  roomConverter,
  gameConverter,
  gameSessionConverter,
  participantConverter,
} from "@/lib/utils/converters";

/**
 * gameSessions -> [codes] -> ((session -> room, game), (participants-> [userId]))
 */
export interface DbGameSession {
  session: {
    room: Room;
    game: Omit<Game, "participants">;
  };
  participants: {
    [identifier: UserIdOrName]: Participant;
  };
  code: string;
}

export const getGameSessionCollection = (db: any) =>
  db().collection("gameSessions");

export const getGameSessionDoc = (db: any, code: string) =>
  getGameSessionCollection(db).doc(code).withConverter(gameSessionConverter);

export const getRoomDoc = (db: any, code: string) =>
  getGameSessionDoc(db, code)
    .collection("session")
    .doc("room")
    .withConverter(roomConverter);

export const getGameDoc = (db: any, code: string) =>
  getGameSessionDoc(db, code)
    .collection("session")
    .doc("game")
    .withConverter(gameConverter);

export const getParticipantsCol = (
  db: any,
  code: string,
  withConverter?: boolean,
) =>
  getGameSessionDoc(db, code)
    .collection("participants")
    .withConverter(withConverter ? participantConverter : undefined);

export const getParticipantDoc = (db: any, code: string, userId: string) =>
  getGameSessionDoc(db, code)
    .collection("participants")
    .doc(userId)
    .withConverter(participantConverter);
