"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

type Ad = {
  _id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
};

export default function SavedPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await api.get("/ads/saved");
        setAds(res.data);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">❤️ Saved Items</h1>

      {ads.length === 0 ? (
        <div className="rounded-xl border p-6 text-center text-gray-500">
          No saved ads yet
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {ads.map((ad) => (
            <Link key={ad._id} href={`/ads/${ad._id}`}>
              <div className="rounded-xl border p-4 bg-white hover:shadow-md transition">
                <div className="h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img
                    src={ad.images?.[0]}
                    className="w-full h-full object-cover"
                    alt="ad"
                  />
                </div>

                <p className="font-bold text-green-600">₹ {ad.price}</p>
                <p className="text-sm mt-1">{ad.title}</p>
                <p className="text-xs text-gray-500">{ad.location}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
