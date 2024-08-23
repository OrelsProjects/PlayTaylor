import { db } from "@/../firebase.config.admin";
import { roomConverter } from "./roomConverter";
import { RoomDoesNotExistError } from "../../../../models/errors/RoomDoesNotExistError";
import { DocumentReference } from "firebase/firestore";

export async function isOwnerOfRoom(
  userId: string,
  roomCode: string,
  roomRef?: any,
): Promise<boolean> {
  let ref = roomRef;
  if (!ref) {
    const database = db();
    ref = database
      .collection("rooms")
      .doc(roomCode)
      .withConverter(roomConverter);
  }
  const roomSnapshot = await ref.get();
  const roomData = roomSnapshot.data();

  if (!roomData) {
    throw new RoomDoesNotExistError();
  }

  const creator = roomData.createdBy;

  return userId === creator;
}
