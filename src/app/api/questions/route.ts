import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../auth/authOptions";
import prisma from "../_db/db";
import Logger from "../../../loggerServer";
import { Question } from "@prisma/client";

async function isUserAdmin(userId: string): Promise<boolean> {
  const user = await prisma.appUser.findUnique({
    where: { userId },
  });
  return user?.role === "admin";
}

export async function GET(req: NextRequest): Promise<any> {
  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }
  const session = await getServerSession(authOptions);
  try {
    const questions = await prisma.question.findMany({
      include: { options: true },
    });

    return NextResponse.json({ questions });
  } catch (error: any) {
    Logger.error(
      "Error getting questions",
      session?.user?.userId || "unknown",
      {
        error,
      },
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<any> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const isAdmin = await isUserAdmin(session.user?.userId);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { question }: { question: Question } = await req.json();
    const { id, ...questionNoId } = question;
    const newQuestion = await prisma.question.create({
      data: questionNoId,
    });
    return NextResponse.json({ question: newQuestion });
  } catch (error: any) {
    Logger.error(
      "Error creating a question",
      session.user.userId || "unknown",
      {
        error,
      },
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest): Promise<any> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const isAdmin = await isUserAdmin(session.user?.userId);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { question }: { question: Question } = await req.json();
    const { id, ...questionNoId } = question;
    await prisma.question.update({
      where: { id },
      data: { ...questionNoId },
    });
    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    Logger.error(
      "Error updating a question",
      session.user.userId || "unknown",
      {
        error,
      },
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest): Promise<any> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const isAdmin = await isUserAdmin(session.user?.userId);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id }: { id: string } = await req.json();
    await prisma.question.delete({
      where: { id },
    });
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
