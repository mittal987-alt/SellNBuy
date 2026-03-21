import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Ad from "@/models/Ad";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const productName = searchParams.get("productName");
    const condition = searchParams.get("condition") || "good";
    const yearsUsed = Number(searchParams.get("yearsUsed")) || 0;

    if (!productName) {
      return NextResponse.json(
        { message: "Product name is required" },
        { status: 400 }
      );
    }

    // 1. Search for similar ads (Try exact match first)
    let similarAds = await Ad.find({
      title: { $regex: productName, $options: "i" },
      status: "active",
    })
      .limit(10)
      .sort({ createdAt: -1 });

    // Fallback: If no exact matches, try searching for individual words
    if (similarAds.length === 0) {
      const words = productName.split(/\s+/).filter(w => w.length > 2);
      if (words.length > 0) {
        const regexQuery = words.map(w => `(?=.*${w})`).join("");
        similarAds = await Ad.find({
          title: { $regex: regexQuery, $options: "i" },
          status: "active",
        })
          .limit(10)
          .sort({ createdAt: -1 });
      }
    }

    // Second Fallback: Just search for any of the words if multi-word search failed
    if (similarAds.length === 0) {
      const words = productName.split(/\s+/).filter(w => w.length > 2);
      if (words.length > 0) {
        similarAds = await Ad.find({
          title: { $regex: words.join("|"), $options: "i" },
          status: "active",
        })
          .limit(10)
          .sort({ createdAt: -1 });
      }
    }

    if (similarAds.length === 0) {
      return NextResponse.json({
        message: "Not enough data to provide a suggestion",
        suggestedPrice: null,
        averagePrice: null,
        similarAds: [],
      });
    }

    // 2. Calculate average price
    const totalContentPrice = similarAds.reduce((sum, ad) => sum + ad.price, 0);
    const averagePrice = totalContentPrice / similarAds.length;

    // 3. Apply Multipliers
    let conditionMultiplier = 0.85; // Default "good"
    switch (condition.toLowerCase()) {
      case "new":
      case "excellent":
        conditionMultiplier = 1.0;
        break;
      case "good":
        conditionMultiplier = 0.85;
        break;
      case "fair":
        conditionMultiplier = 0.7;
        break;
      case "poor":
        conditionMultiplier = 0.5;
        break;
    }

    // 4. Age Depreciation (5% per year, max 50%)
    const ageDepreciation = Math.min(0.5, yearsUsed * 0.05);
    
    // 5. Calculate Suggested Price
    const suggestedPrice = Math.round(averagePrice * conditionMultiplier * (1 - ageDepreciation));

    return NextResponse.json({
      productName,
      condition,
      yearsUsed,
      suggestedPrice,
      averagePrice: Math.round(averagePrice),
      similarAds,
    });

  } catch (err) {
    console.error("PRICE ESTIMATOR ERROR:", err);
    return NextResponse.json(
      { message: "Failed to estimate price" },
      { status: 500 }
    );
  }
}
