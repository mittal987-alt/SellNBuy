export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Ad from "@/models/Ad";

const JWT_SECRET = process.env.JWT_SECRET!;

/* =========================================================
   GET ALL ADS (WITH FILTERS + PAGINATION)
========================================================= */

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search");
    const city = searchParams.get("city");
    const min = searchParams.get("min");
    const max = searchParams.get("max");
    const sort = searchParams.get("sort");
    const category = searchParams.get("category");

    const page = Number(searchParams.get("page")) || 1;
    const limit = 8;

    const filter: any = {};

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (city) {
      filter.location = { $regex: city, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    if (min || max) {
      filter.price = {};
      if (min) filter.price.$gte = Number(min);
      if (max) filter.price.$lte = Number(max);
    }

    let query = Ad.find(filter);

    if (sort === "price_low") {
      query = query.sort({ price: 1 });
    } else if (sort === "price_high") {
      query = query.sort({ price: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const total = await Ad.countDocuments(filter);

    const ads = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "name email");

    return NextResponse.json({
      ads,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });

  } catch (error) {
    console.error("GET ADS ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch ads" },
      { status: 500 }
    );
  }
}

/* =========================================================
   CREATE AD (FIXED FOR FORMDATA)
========================================================= */
export async function POST(req: Request) {
  try {
    await connectDB();

    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let user: any;

    try {
      user = jwt.verify(token, JWT_SECRET);
      console.log("JWT USER:", user);   // 👈 ADD THIS
    } catch (err) {
      console.log("JWT ERROR:", err);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Accept either JSON (from client) or FormData (e.g., multipart)
    const contentType = req.headers.get("content-type") || "";
    let payload: any = {};

    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else {
      const formData = await req.formData();
      // build payload from FormData
      payload = {
        title: formData.get("title"),
        price: formData.get("price"),
        description: formData.get("description"),
        location: formData.get("location"),
        yearsUsed: formData.get("yearsUsed"),
        category: formData.get("category"),
        // try getAll for arrays, fallback to single value
        images: typeof (formData as any).getAll === "function" ? (formData as any).getAll("images") : [],
      };
    }

    console.log("CREATE AD PAYLOAD:", payload);

    const ad = await Ad.create({
      title: payload.title,
      price: Number(payload.price),
      description: payload.description,
      location: payload.location,
      yearsUsed: Number(payload.yearsUsed) || 0,
      category: payload.category,
      images: payload.images || [],
      user: user.id || user._id,
    });

    return NextResponse.json(ad, { status: 201 });

  } catch (error) {
    console.error("CREATE AD ERROR:", error);  // 👈 THIS WILL SHOW REAL ERROR
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}