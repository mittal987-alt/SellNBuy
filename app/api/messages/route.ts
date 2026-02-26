import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import Message from "@/models/Message";

export async function POST(req: Request) {
  await connectDB();

  const user = await getUserFromToken();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { chatId, text } = await req.json();

  const message = await Message.create({
    chat: chatId,
    sender: user.id,
    text,
  });

  return NextResponse.json(message);
}
