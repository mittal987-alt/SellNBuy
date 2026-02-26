import { NextResponse ,NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import Ad from "@/models/Ad";

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

    // ✅ Find ads where current user saved them
    const ads = await Ad.find({
      savedBy: user.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json(ads);

  } catch (error) {
    console.error("SAVED FETCH ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch saved ads" },
      { status: 500 }
    );
  }
}
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const ad = await Ad.findById(id);
    if (!ad) {
      return NextResponse.json(
        { message: "Ad not found" },
        { status: 404 }
      );
    }

    // initialize if not exists
    if (!ad.savedBy) {
      ad.savedBy = [];
    }

    const alreadySaved = ad.savedBy.includes(user.id);

    if (alreadySaved) {
      // ❌ Unsave
      ad.savedBy = ad.savedBy.filter(
        (uid: string) => uid !== user.id
      );
    } else {
      // ✅ Save
      ad.savedBy.push(user.id);
    }

    await ad.save();

    return NextResponse.json({
      message: alreadySaved ? "Unsaved" : "Saved",
      saved: !alreadySaved,
    });

  } catch (error) {
    console.error("SAVE ERROR:", error);
    return NextResponse.json(
      { message: "Save failed" },
      { status: 500 }
    );
  }
}
