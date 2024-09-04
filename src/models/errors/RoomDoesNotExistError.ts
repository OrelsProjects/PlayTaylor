export class GameDoesNotExistError extends Error {
  constructor() {
    super("Room does not exist");
    this.name = "RoomDoesNotExistError";
  }
}
