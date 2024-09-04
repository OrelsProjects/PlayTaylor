import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../auth/authOptions";
import prisma from "../../_db/db";
import Logger from "../../../../loggerServer";

async function isUserAdmin(userId: string): Promise<boolean> {
  const user = await prisma.appUser.findUnique({
    where: { userId },
  });
  return user?.role === "admin";
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  },
): Promise<any> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const isAdmin = await isUserAdmin(session.user?.userId);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.question.delete({
      where: { id: params.id },
    });
    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    Logger.error(
      "Error deleting a question",
      session.user.userId || "unknown",
      {
        error,
      },
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
