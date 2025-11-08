import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

  const appConfig = await prisma.appConfig.findFirst();
  if (!appConfig) {
    return NextResponse.json({ success: false, message: "Don't find password" }, { status: 400 });
  }

  const isValid = password === appConfig.password;

  if (!isValid) {
    return NextResponse.json({ success: false, message: "wrong password" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("app_auth", "true", { httpOnly: true });
  return res;
}
