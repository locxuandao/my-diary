import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("query") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  const [total, memories] = await Promise.all([
    prisma.memory.count({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { thoughts: { contains: query, mode: "insensitive" } },
        ],
      },
    }),
    prisma.memory.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { thoughts: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    data: memories,
    pagination: {
      total,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
}

export async function POST(req: Request) {
  const { title, thoughts, mood, photos } = await req.json();

  if (!thoughts) {
    return NextResponse.json({ error: "Thoughts are required" }, { status: 400 });
  }

  const memory = await prisma.memory.create({
    data: { title, thoughts, mood, photos },
  });

  return NextResponse.json(memory);
}
