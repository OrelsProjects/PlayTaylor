import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../../auth/authOptions";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: NextRequest): Promise<Response> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return new Promise((resolve, reject) => {
    let i = 0;
    try {
      const interval = setInterval(() => {
        console.log(i + " seconds passed");
        i += 1;
        if (i === 55) {
          clearInterval(interval);
          resolve(NextResponse.json({ text: "done" }));
        }
      }, 1000);
    } catch (error: any) {
      reject(NextResponse.json({ error: error.message }, { status: 500 }));
    }
  });
}
