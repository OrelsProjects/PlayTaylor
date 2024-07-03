import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/auth/authOptions";
import Logger from "@/loggerServer";
import { QuestionResponse } from "@prisma/client";
import prisma from "../../../_db/db";

export async function POST(req: NextRequest): Promise<any> {
  const session = await getServerSession(authOptions);
  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    const { questionResponse }: { questionResponse: QuestionResponse } =
      await req.json();
    const { id, ...questionResponseNoId } = questionResponse;
    const questionResponseWithId = await prisma.questionResponse.create({
      data: questionResponseNoId,
    });
    return NextResponse.json(questionResponseWithId);
  } catch (error: any) {
    Logger.error(
      "Error creating a question",
      session?.user.userId || "unknown",
      {
        error,
      },
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
