import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export function GET(req: NextRequest) {
  // wait for 55 seconds the nreturn. Do in in interval, and print something every 5 seconds
  // Then return NextResponse.json({ text: "done" });
  return new Promise(resolve => {
    let i = 0;
    const interval = setInterval(() => {
      console.log(i + " seconds passed");
      i += 1;
      if (i === 71) {
        clearInterval(interval);
        resolve(NextResponse.json({ text: "done" }));
      }
    }, 1000);
  });
}
