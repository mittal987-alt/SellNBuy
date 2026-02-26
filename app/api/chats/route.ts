import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import Chat from "@/models/Chat";

export async function GET() {
  try {
    await connectDB();

    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const chats = await Chat.find({
      participants: user.id,
    })
      .populate("ad", "title images price")
      .populate("participants", "name email")
      .sort({ updatedAt: -1 });

    const formattedChats = chats.map((chat: any) => {
      const otherUser = chat.participants.find(
        (p: any) => p._id.toString() !== user.id
      );

      return {
        _id: chat._id,
        ad: chat.ad,
        otherUser,
      };
    });

    return NextResponse.json(formattedChats);

  } catch (error) {
    console.error("CHAT LIST ERROR:", error);
    return NextResponse.json(
      { message: "Failed to load chats" },
      { status: 500 }
    );
  }
}