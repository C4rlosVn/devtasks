import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const { title, priority } = await request.json();
  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  const task = await prisma.task.create({
    data: { title: title.trim(), priority: priority || "medium" },
  });
  return NextResponse.json(task, { status: 201 });
}
