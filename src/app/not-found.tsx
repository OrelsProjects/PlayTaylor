"use client";

import React from "react";
import { Button } from "../components/ui/button";
import { useCustomRouter } from "../lib/hooks/useCustomRouter";

const NotFound = () => {
  const router = useCustomRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>404</div>
      <Button onClick={() => router.push("/home")}>Go home</Button>
    </main>
  );
};

export default NotFound;
