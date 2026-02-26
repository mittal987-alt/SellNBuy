import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import Chat from "@/models/Chat";
import Ad from "@/models/Ad";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ adId: string }> }
) {
  await connectDB();

  const user = await getUserFromToken();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { adId } = await context.params;

  const ad = await Ad.findById(adId);
  if (!ad)
    return NextResponse.json({ message: "Ad not found" }, { status: 404 });

  // prevent self chat
  if (ad.user.toString() === user.id)
    return NextResponse.json(
      { message: "You cannot chat with your own ad" },
      { status: 400 }
    );

  // existing chat
  let chat = await Chat.findOne({
    ad: adId,
    buyer: user.id,
  });

  if (!chat) {
    chat = await Chat.create({
      ad: adId,
      buyer: user.id,
      seller: ad.user,
    });
  }

  return NextResponse.json({ chatId: chat._id });
}
