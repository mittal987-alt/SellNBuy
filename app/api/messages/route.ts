import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import Chat from "@/models/Chat";
import { getUserFromToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getUserFromToken();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { chatId, text } = await req.json();

    // 1. Create the message
    const newMessage = await Message.create({
      chatId,
      sender: user.id,
      text,
    });

    // 2. Update the Chat model with the latest text for the preview
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: text,
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    return NextResponse.json({ message: "Error sending message" }, { status: 500 });
  }
}