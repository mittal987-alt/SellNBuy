import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import Ad from "@/models/Ad";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const user = await getUserFromToken();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const ad = await Ad.findById(id);
  if (!ad) {
    return NextResponse.json({ message: "Ad not found" }, { status: 404 });
  }

  const alreadySaved = ad.savedBy.includes(user.id);

  if (alreadySaved) {
    ad.savedBy = ad.savedBy.filter((uid: string) => uid !== user.id);
  } else {
    ad.savedBy.push(user.id);
  }

  await ad.save();

  return NextResponse.json({ saved: !alreadySaved });
}
