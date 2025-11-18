import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const memory = await prisma.memory.findUnique({
      where: { id },
    });

    if (!memory) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    return NextResponse.json(memory);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch memory" }, { status: 500 });
  }
}
