export class GamePausedError extends Error {
  constructor() {
    super("Game is paused");
    this.name = "GamePausedError";
  }
}
