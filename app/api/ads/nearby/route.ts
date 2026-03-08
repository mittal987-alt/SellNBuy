import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Ad from "@/models/Ads";

export async function POST(req: NextRequest) {

  await connectDB();

  const { lat, lng } = await req.json();

  const ads = await Ad.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat]
        },
        $maxDistance: 100
      }
    }
  });

  return NextResponse.json(ads);
}