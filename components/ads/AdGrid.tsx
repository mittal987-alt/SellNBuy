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

type Props = {
  search: string;
};

export default function AdGrid({ search }: Props) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch ads when search changes
  useEffect(() => {
    setLoading(true);

    api
      .get("/ads", {
        params: { search: debouncedSearch },
      })
      .then((res) => {
        setAds(res.data?.ads ?? res.data ?? []);
      })
      .catch((err) => {
        console.error("Failed to fetch ads:", err);
        setError("Failed to load ads");
      })
      .finally(() => setLoading(false));
  }, [debouncedSearch]);

  if (loading) {
    return <p className="text-gray-500">Loading ads...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!ads.length) {
    return (
      <p className="text-gray-500">
        No ads available right now
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {ads.map((ad) => (
        <Link
          key={ad._id}
          href={`/ads/${ad._id}`}
          className="rounded-2xl border bg-white dark:bg-neutral-900 hover:shadow-lg transition overflow-hidden"
        >
          <div className="h-36 bg-gray-100 dark:bg-neutral-800">
            <img
              src={ad.images?.[0] || "/placeholder.png"}
              alt={ad.title}
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
              {ad.location}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}