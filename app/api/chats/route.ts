import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import Chat from "@/models/Chat";

export async function GET() {
  await connectDB();
  const user = getUserFromToken();
  if (!user) return NextResponse.json([]);

  const chats = await Chat.find({ members: user.id });
  return NextResponse.json(chats);
}
