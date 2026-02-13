export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Ad from "@/models/Ad";

const JWT_SECRET = process.env.JWT_SECRET!;

/* ---------------- GET ALL ADS ---------------- */

export async function GET() {
  try {
    await connectDB();

    const ads = await Ad.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email"); // optional

    return NextResponse.json(ads, { status: 200 });

  } catch (error) {
    console.error("GET ADS ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch ads" },
      { status: 500 }
    );
  }
}

/* ---------------- CREATE AD ---------------- */

export async function POST(req: Request) {
  try {
    await connectDB();

    // ✅ IMPORTANT for Next.js 15+
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    let user: any;
    try {
      user = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const ad = await Ad.create({
      title: body.title,
      price: body.price,
      description: body.description,
      location: body.location,
      yearsUsed: body.yearsUsed,
      images: body.images || [],
      user: user.id,
    });

    return NextResponse.json(ad, { status: 201 });

  } catch (error) {
    console.error("CREATE AD ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
