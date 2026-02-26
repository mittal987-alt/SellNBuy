import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import Chat from "@/models/Chat";

export async function POST(req: Request) {
  await connectDB();

  const user = await getUserFromToken();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { adId, sellerId } = await req.json();

  // Check existing chat
  let chat = await Chat.findOne({
    ad: adId,
    participants: { $all: [user.id, sellerId] },
  });

  if (!chat) {
    chat = await Chat.create({
      ad: adId,
      participants: [user.id, sellerId],
    });
  }

  return NextResponse.json(chat);
}