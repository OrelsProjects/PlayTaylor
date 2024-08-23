export class RoomDoesNotExistError extends Error {
  constructor() {
    super("Room does not exist");
    this.name = "RoomDoesNotExistError";
  }
}
