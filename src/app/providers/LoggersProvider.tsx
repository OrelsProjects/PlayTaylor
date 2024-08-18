"use client";

import { useEffect } from "react";
import { initEventTracker } from "../../eventTracker";
import { initLogger } from "../../logger";

export default function LoggersProvider() {
  useEffect(() => {
    initLogger();
    initEventTracker();
  }, []);

  return null;
}
