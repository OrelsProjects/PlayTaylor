import { GameDoesNotExistError } from "@/models/errors/RoomDoesNotExistError";
import { roomDocServer } from "@/app/api/_db/firestoreServer";

export async function isOwnerOfRoom(
  userId: string,
  roomCode: string,
): Promise<boolean> {
  const roomData = (await roomDocServer(roomCode).get()).data();

  if (!roomData) {
    throw new GameDoesNotExistError();
  }

  const creator = roomData.createdBy;

  return userId === creator;
}
