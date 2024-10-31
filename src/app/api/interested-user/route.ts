import { NextRequest, NextResponse } from "next/server";
import prisma from "../_db/db";
import loggerServer from "../../../loggerServer";

export async function POST(req: NextRequest) {
  let email = "";
  try {
    const body = await req.json();
    email = body.email;
    const now = new Date();

    await prisma.interestedUser.create({
      data: {
        email,
        signedUpAt: now,
      },
    });
    return NextResponse.json({}, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({}, { status: 200 });
    }
    loggerServer.error("Error signing new user", email, {
      data: { error },
    });
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

// write a get function that returns all the interested users in objecT: {count: number}, like the function above

export async function GET() {
  try {
    const count = await prisma.interestedUser.count();
    return NextResponse.json({ count }, { status: 200 });
  } catch (error: any) {
    loggerServer.error("Error in getting interested users", "system", {
      data: { error },
    });
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
