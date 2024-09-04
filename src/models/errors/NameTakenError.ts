export class NameTakenError extends Error {
  constructor() {
    super("Name taken");
    this.name = "NameTakenError";
  }
}
