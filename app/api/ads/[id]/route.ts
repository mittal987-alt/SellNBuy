import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import Ad from "@/models/Ad";

/* ================= DELETE ================= */
/* ================= GET SINGLE AD ================= */

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const ad = await Ad.findById(id);

    if (!ad) {
      return NextResponse.json(
        { message: "Ad not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(ad);

  } catch (error) {
    console.error("GET AD ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch ad" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // ✅ IMPORTANT: await params
    const { id } = await context.params;

    const ad = await Ad.findById(id);
    if (!ad) {
      return NextResponse.json(
        { message: "Ad not found" },
        { status: 404 }
      );
    }

    // optional: owner check
    if (ad.user.toString() !== user.id) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    await ad.deleteOne();

    return NextResponse.json({ message: "Ad deleted" });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { message: "Delete failed" },
      { status: 500 }
    );
  }
}

/* ================= UPDATE ================= */

export async function PUT(
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
    const body = await req.json();

    const ad = await Ad.findById(id);
    if (!ad) {
      return NextResponse.json(
        { message: "Ad not found" },
        { status: 404 }
      );
    }

    if (ad.user.toString() !== user.id) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    Object.assign(ad, body);
    await ad.save();

    return NextResponse.json(ad);

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json(
      { message: "Update failed" },
      { status: 500 }
    );
  }
}
