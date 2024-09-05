export class NoParticipantsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NoParticipantsError";
  }
}
