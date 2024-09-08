export class CountersDoNotExistError extends Error {
    constructor() {
        super("Counters do not exist");
        this.name = "CountersDoNotExistError";
    }
    }