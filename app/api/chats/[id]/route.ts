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

    const { id } = await context.params;

    const chat = await Chat.findById(id);
    if (!chat)
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });

    // FIX: Changed 'chat' to 'chatId' to match your Message model
    const messages = await Message.find({ chatId: id }).sort({ createdAt: 1 });

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

    if (!text) {
        return NextResponse.json({ message: "Text is required" }, { status: 400 });
    }

    // FIX: Changed 'chat' to 'chatId' to satisfy the Mongoose ValidatorError
    const message = await Message.create({
      chatId: id,
      sender: user.id,
      text,
    });

    // OPTIONAL: Update the Chat model so the list view shows the latest message
    await Chat.findByIdAndUpdate(id, { lastMessage: text });

    return NextResponse.json(message);

  } catch (err: any) {
    console.error("SEND MESSAGE ERROR:", err);
    // Returning the specific error message helps you debug validation issues
    return NextResponse.json({ message: err.message || "Send failed" }, { status: 500 });
  }
}