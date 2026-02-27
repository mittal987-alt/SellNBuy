"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

type User = {
  name: string;
  email: string;
  role: "buyer" | "seller";
};

type Ad = {
  _id: string;
  title: string;
  price: number;
  images: string[];
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/auth/me");
        setUser(userRes.data);

        if (userRes.data.role === "seller") {
          const adsRes = await api.get("/ads/my");
          setAds(adsRes.data);
        }
      } catch (err) {
        console.error("Profile load error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="p-6">Loading profile...</p>;

  if (!user) return <p>User not found</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">

      {/* USER CARD */}
      <div className="rounded-2xl border p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>

            <span
              className={`inline-block mt-2 text-xs px-3 py-1 rounded-full ${
                user.role === "seller"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-purple-100 text-purple-600"
              }`}
            >
              {user.role}
            </span>
          </div>

          <Link
            href="/profile/edit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* SELLER SECTION */}
      {user.role === "seller" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">My Listings</h2>

          {ads.length === 0 ? (
            <p className="text-gray-500">No ads posted yet</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ads.map((ad) => (
                <div
                  key={ad._id}
                  className="rounded-xl border p-3 bg-white"
                >
                  <img
                    src={ad.images?.[0] || "/placeholder.png"}
                    className="h-28 w-full object-cover rounded-lg"
                  />
                  <p className="text-green-600 font-bold mt-2">
                    ₹ {ad.price}
                  </p>
                  <p className="text-sm">{ad.title}</p>

                  <div className="flex justify-between mt-2 text-xs">
                    <Link
                      href={`/dashboard/seller/edit/${ad._id}`}
                      className="text-blue-600"
                    >
                      Edit
                    </Link>

                    <button className="text-red-500">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="rounded-2xl border p-6 bg-white space-y-4">
        <Link
          href="/chats"
          className="block text-blue-600 font-medium"
        >
          💬 View My Chats
        </Link>

        <Link
          href="/saved"
          className="block text-blue-600 font-medium"
        >
          ❤️ Saved Items
        </Link>

        <button
          onClick={() => {
            api.post("/auth/logout").then(() => {
              window.location.href = "/";
            });
          }}
          className="text-red-600 font-medium"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}