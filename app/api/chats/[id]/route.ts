import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import Chat from "@/models/Chat";
import Message from "@/models/Message";

/* ================= GET MESSAGES ================= */

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const user = await getUserFromToken();
    if (!user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // ⭐ MUST AWAIT PARAMS
    const { id } = await context.params;

    const chat = await Chat.findById(id);
    if (!chat)
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });

    const messages = await Message.find({ chat: id }).sort({ createdAt: 1 });

    return NextResponse.json(messages);

  } catch (err) {
    console.error("GET CHAT ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/* ================= SEND MESSAGE ================= */

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const user = await getUserFromToken();
    if (!user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    const { text } = await req.json();

    const message = await Message.create({
      chat: id,
      sender: user.id,
      text,
    });

    return NextResponse.json(message);

  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    return NextResponse.json({ message: "Send failed" }, { status: 500 });
  }
}
