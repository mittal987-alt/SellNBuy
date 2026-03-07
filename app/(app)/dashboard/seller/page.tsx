"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

/* ---------------- SIDEBAR ---------------- */

/* ---------------- TYPES ---------------- */

type Ad = {
  _id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
};

export default function SellerDashboard() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [chatCount, setChatCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /* ---------------- FETCH ADS + CHATS ---------------- */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adsRes, chatsRes] = await Promise.all([
          api.get("/ads/my"),
          api.get("/chats"),
        ]);

        setAds(adsRes.data);
        setChatCount(chatsRes.data.length);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------------- DELETE AD ---------------- */

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this ad?")) return;

    try {
      setDeletingId(id);
      await api.delete(`/ads/${id}`);
      setAds((prev) => prev.filter((ad) => ad._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete ad");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-12 gap-6">

        {/* SIDEBAR */}
        <aside className="hidden md:block md:col-span-3 lg:col-span-2">
          <div className="sticky top-24">
           
          </div>
        </aside>

        {/* MAIN */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10 space-y-10">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Seller Dashboard</h1>
              <p className="text-gray-500">
                Manage your ads and track performance
              </p>
            </div>

            <Link
              href="/create-ad"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition shadow"
            >
              + Post New Ad
            </Link>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Active Ads" value={ads.length.toString()} />
            <StatCard label="Sold Items" value="0" />
            <StatCard label="Total Views" value="0" />
            <StatCard label="Messages" value={chatCount.toString()} />
          </div>

          {/* LISTINGS */}
          <section>
            <h2 className="text-xl font-semibold mb-4">My Listings</h2>

            {loading ? (
              <p className="text-gray-500">Loading ads...</p>
            ) : ads.length === 0 ? (
              <div className="rounded-xl border p-6 text-center text-gray-500 bg-white dark:bg-neutral-900">
                You haven’t posted any ads yet
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ads.map((ad) => (
                  <ListingCard
                    key={ad._id}
                    ad={ad}
                    deleting={deletingId === ad._id}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}

/* ---------------- STAT CARD ---------------- */

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border p-5 bg-white dark:bg-neutral-900">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

/* ---------------- LISTING CARD ---------------- */

function ListingCard({
  ad,
  deleting,
  onDelete,
}: {
  ad: Ad;
  deleting: boolean;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border p-4 bg-white dark:bg-neutral-900 hover:shadow-md transition">

      {/* CLICKABLE AREA */}
      <Link href={`/ads/${ad._id}`} className="block">
        <div className="h-32 bg-gray-100 dark:bg-neutral-800 rounded-lg mb-3 overflow-hidden">
          <img
            src={ad.images?.[0] || "/placeholder.png"}
            className="w-full h-full object-cover"
            alt="ad"
          />
        </div>

        <p className="font-bold text-green-600">₹ {ad.price}</p>
        <p className="text-sm font-medium mt-1">{ad.title}</p>
        <p className="text-xs text-gray-500 mt-1">{ad.location}</p>
      </Link>

      {/* ACTION BUTTONS */}
      <div className="flex justify-between mt-3 text-xs">
        <Link
          href={`/dashboard/seller/edit/${ad._id}`}
          className="text-blue-600 hover:underline"
        >
          Edit
        </Link>

        <button
          disabled={deleting}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(ad._id);
          }}
          className="text-red-500 disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
