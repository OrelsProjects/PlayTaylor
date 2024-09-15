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
    // if duplicate, return 200
    if (error.code === "P2002") {
      return NextResponse.json({}, { status: 200 });
    }
    loggerServer.error("Error in sign-interested-user route", email, {
      data: { error },
    });
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
