export class AnsweredTooLateError extends Error {
  constructor() {
    super("Answered too late");
    this.name = "AnsweredTooLateError";
  }
}
