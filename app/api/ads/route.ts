export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Ad from "@/models/Ad";

const JWT_SECRET = process.env.JWT_SECRET!;

/* =========================================================
   GET ADS (FILTERS + NEARBY + PAGINATION)
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
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius");

    const page = Number(searchParams.get("page")) || 1;
    const limit = 8;

    const filter: any = {};

    /* SEARCH */

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    /* CITY */

    if (city) {
      filter.locationName = { $regex: city, $options: "i" };
    }

    /* CATEGORY */

    if (category) {
      filter.category = category;
    }

    /* PRICE */

    if (min || max) {
      filter.price = {};

      if (min) filter.price.$gte = Number(min);
      if (max) filter.price.$lte = Number(max);
    }

    /* NEARBY SEARCH */

    if (lat && lng && radius) {
      filter.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          $maxDistance: Number(radius),
        },
      };
    }

    /* SORT */

    let query = Ad.find(filter);

    if (sort === "price_low") {
      query = query.sort({ price: 1 });
    } else if (sort === "price_high") {
      query = query.sort({ price: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    /* COUNT */

    let total;

    if (lat && lng && radius) {
      const countFilter = { ...filter };
      delete countFilter.location;
      total = await Ad.countDocuments(countFilter);
    } else {
      total = await Ad.countDocuments(filter);
    }

    /* FETCH */

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
   CREATE AD
========================================================= */

export async function POST(req: Request) {
  try {
    await connectDB();

    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user: any = jwt.verify(token, JWT_SECRET);

    const body = await req.json();

    const {
      title,
      price,
      description,
      location,
      category,
      yearsUsed,
      lat,
      lng,
      images
    } = body;

    const ad = await Ad.create({
      title,
      price: Number(price),
      description,
      locationName: location,
      category,
      yearsUsed: Number(yearsUsed) || 0,
      images,

      location: {
        type: "Point",
        coordinates: [Number(lng), Number(lat)],
      },

      user: user.id || user._id,
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