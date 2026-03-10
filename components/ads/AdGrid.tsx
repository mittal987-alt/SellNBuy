"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";

type Ad = {
  _id: string;
  title: string;
  price: number;
  locationName: string;
  images: string[];
};

type Props = {
  search: string;
  type?: "saved" | "nearby" | "trending";
  layout?: "grid" | "horizontal";
  limit?: number;
  hoverEffect?: string;
};

export default function AdGrid({
  search,
  type,
  layout = "grid",
  limit,
  hoverEffect,
}: Props) {

  const [ads, setAds] = useState<Ad[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- GET USER LOCATION (FOR NEARBY) ---------------- */

  useEffect(() => {

    if (type === "nearby") {

      navigator.geolocation.getCurrentPosition((position) => {

        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

      });

    }

  }, [type]);

  /* ---------------- FETCH ADS ---------------- */

  useEffect(() => {

    if (type === "nearby" && !location) return;

    const params: any = {
      search,
    };

    if (type === "nearby" && location) {
      params.lat = location.lat;
      params.lng = location.lng;
      params.radius = 100;
    }

    let url = "/ads";

    // ⭐ Wishlist
    if (type === "saved") {
      url = "/ads/saved";
    }

    api
      .get(url, { params })
      .then((res) => {

        // saved API returns array directly
        let fetched = type === "saved" ? res.data : res.data.ads;

        if (limit) fetched = fetched.slice(0, limit);

        setAds(fetched);

      })
      .catch((err) => {

        console.error("Error fetching ads:", err);

      })
      .finally(() => setLoading(false));

  }, [search, location, type, limit]);

  /* ---------------- LOADING ---------------- */

  if (loading) return <p>Loading ads...</p>;

  /* ---------------- EMPTY STATES ---------------- */

  if (!ads.length) {

    if (type === "saved") return <p>No saved items yet</p>;
    if (type === "nearby") return <p>No ads nearby</p>;

    return <p>No ads found</p>;
  }

  /* ---------------- UI ---------------- */

  return (
    <div
      className={
        layout === "horizontal"
          ? "flex gap-5 overflow-x-auto"
          : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
      }
    >

      {ads.map((ad) => (

        <Link
          key={ad._id}
          href={`/ads/${ad._id}`}
          className={`rounded-2xl border bg-white hover:shadow-lg transition overflow-hidden ${
            hoverEffect === "lift" ? "hover:scale-105" : ""
          }`}
        >

          <div className="h-36 bg-gray-100">
            <Image
              src={ad.images?.[0] || "/placeholder.png"}
              alt={ad.title}
              width={200}
              height={144}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-4 space-y-1">

            <p className="text-green-600 font-bold text-lg">
              ₹ {ad.price}
            </p>

            <p className="text-sm font-medium line-clamp-2">
              {ad.title}
            </p>

            <p className="text-xs text-gray-500">
              {ad.locationName}
            </p>

          </div>

        </Link>

      ))}

    </div>
  );
}