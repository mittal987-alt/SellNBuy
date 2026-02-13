"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

type Ad = {
  _id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
};

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await api.get("/ads");
        setAds(res.data);
      } catch (err) {
        console.error("Failed to load ads", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  if (loading) {
    return <p className="p-6">Loading ads...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Browse Ads</h1>

      {ads.length === 0 ? (
        <div className="rounded-xl border p-6 text-center text-gray-500 bg-white dark:bg-neutral-900">
          No ads available
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {ads.map((ad) => (
            <AdCard key={ad._id} ad={ad} />
          ))}
        </div>
      )}
    </div>
  );
}

function AdCard({ ad }: { ad: Ad }) {
  return (
    <Link href={`/ads/${ad._id}`}>
      <div className="rounded-2xl border bg-white dark:bg-neutral-900 hover:shadow-lg transition cursor-pointer">

        {/* IMAGE */}
        <div className="h-40 overflow-hidden rounded-t-2xl bg-gray-100">
          <img
            src={ad.images?.[0] || "/placeholder.png"}
            alt={ad.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4">
          <p className="font-bold text-green-600 text-lg">
            ₹ {ad.price}
          </p>
          <p className="text-sm font-medium mt-1">
            {ad.title}
          </p>
          <p className="text-xs text-gray-500">
            {ad.location}
          </p>
        </div>
      </div>
    </Link>
  );
}
