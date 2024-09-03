import { Game, UserIdOrName, Participant } from "@/models/game";
import Room from "@/models/room";
import {
  gameConverter,
  gameSessionConverter,
  manyParticipantsConverter,
  participantConverter,
  roomConverter,
} from "@/lib/utils/roomConverter";

/**
 * gameSessions -> [codes] -> ((session -> room, game), (participants-> [userId]))
 */
export interface DbGameSession {
  session: {
    room: Room;
    game: Game;
  };
  participants: {
    [identifier: UserIdOrName]: Participant;
  };
}

export const getGameSessionCollection = (db: any) =>
  db().collection("gameSessions").withConverter(gameSessionConverter);

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

export const getParticipantsCol = (db: any, code: string) =>
  getGameSessionDoc(db, code)
    .collection("participants")
    .withConverter(manyParticipantsConverter);

export const getParticipantDoc = (db: any, code: string, userId: string) =>
    getParticipantsCol(db, code).doc(userId).withConverter(participantConverter);
