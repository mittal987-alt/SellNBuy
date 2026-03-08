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

export default function AdGrid({ search, type, layout = "grid", limit, hoverEffect }: Props) {

  const [ads, setAds] = useState<Ad[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);

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

    api
      .get("/ads", { params })
      .then((res) => {

        let fetched = res.data.ads;

        if (limit) fetched = fetched.slice(0, limit);

        setAds(fetched);

      })
      .finally(() => setLoading(false));

  }, [search, location]);

  if (loading) return <p>Loading ads...</p>;

  if (!ads.length) return <p>No ads nearby</p>;

  return (
    <div className={layout === "horizontal"
      ? "flex gap-5 overflow-x-auto"
      : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
    }>
      {ads.map((ad) => (

        <Link
          key={ad._id}
          href={`/ads/${ad._id}`}
          className={`rounded-2xl border bg-white hover:shadow-lg transition overflow-hidden ${hoverEffect === "lift" ? "hover:scale-105" : ""}`}
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