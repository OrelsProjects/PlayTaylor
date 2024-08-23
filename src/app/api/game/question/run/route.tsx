import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export function GET(req: NextRequest): Promise<Response> {
  return new Promise((resolve, reject) => {
    let i = 0;
    try {
      const interval = setInterval(() => {
        console.log(i + " seconds passed");
        i += 1;
        if (i === 71) {
          clearInterval(interval);
          resolve(NextResponse.json({ text: "done" }));
        }
      }, 1000);
    } catch (error: any) {
      reject(NextResponse.json({ error: error.message }, { status: 500 }));
    }
  });
}
