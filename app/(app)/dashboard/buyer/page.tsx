"use client";

import { useState, useEffect } from "react";
import AdGrid from "@/components/ads/AdGrid";
import Image from "next/image";
import api from "@/lib/api";

import {
  FiHeart,
  FiTrendingUp,
  FiMapPin,
  FiStar,
  FiMonitor,
  FiTruck,
  FiHome,
  FiShoppingBag,
  FiTarget,
} from "react-icons/fi";

type Ad = {
  _id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
};

export default function BuyerDashboard() {
  const [search, setSearch] = useState("");
  const [savedAds, setSavedAds] = useState<Ad[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  useEffect(() => {
    const fetchSavedAds = async () => {
      try {
        const res = await api.get("/ads/saved");
        setSavedAds(res.data);
      } catch (err) {
        console.error("Failed to load saved ads", err);
      } finally {
        setLoadingSaved(false);
      }
    };

    fetchSavedAds();
  }, []);

  const categories = [
    { name: "Electronics", icon: FiMonitor },
    { name: "Vehicles", icon: FiTruck },
    { name: "Real Estate", icon: FiHome },
    { name: "Fashion", icon: FiShoppingBag },
    { name: "Sports", icon: FiTarget },
  ];

  return (
    <div className="w-full px-6 py-6">
      <div className="grid grid-cols-12 gap-8">

        {/* SIDEBAR */}
        <aside className="hidden md:block md:col-span-3 lg:col-span-2">
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>

              <ul className="space-y-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;

                  return (
                    <li key={cat.name}>
                      <button className="flex items-center gap-3 w-full text-left p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition">
                        <Icon className="text-lg text-blue-500" />
                        {cat.name}
                      </button>
                    </li>
                  );
                })}
              </ul>

            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10 space-y-8">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Buyer Dashboard</h1>
              <p className="text-gray-500">
                Discover amazing deals and manage your saved items
              </p>
            </div>
          </div>

          {/* SEARCH */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* SAVED ADS */}
          <Section title="Saved Ads" icon={<FiHeart />}>
            {loadingSaved ? (
              <p className="text-gray-500">Loading saved ads...</p>
            ) : savedAds.length === 0 ? (
              <div className="rounded-xl border p-6 text-center text-gray-500 bg-white dark:bg-neutral-900">
                No saved ads yet
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {savedAds.map((ad) => (
                  <AdCard key={ad._id} ad={ad} />
                ))}
              </div>
            )}
          </Section>

          {/* HIGH DISCOUNT DEALS */}
          <Section title="High Discount Deals" icon={<FiTrendingUp />}>
            <AdGrid search={search} />
          </Section>

          {/* ADS NEAR YOU */}
          <Section title="Ads Near You" icon={<FiMapPin />}>
            <AdGrid search={search} />
          </Section>

          {/* RECOMMENDED */}
          <Section title="Recommended for You" icon={<FiStar />}>
            <AdGrid search={search} />
          </Section>

        </main>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function AdCard({ ad }: { ad: Ad }) {
  return (
    <div className="rounded-xl border p-4 bg-white dark:bg-neutral-900 hover:shadow-md transition">
      <div className="relative h-32 bg-gray-100 dark:bg-neutral-800 rounded-lg mb-3 overflow-hidden">
        <Image
          src={ad.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image"}
          alt="ad"
          fill
          className="object-cover"
        />
      </div>

      <p className="font-bold text-green-600">₹ {ad.price}</p>
      <p className="text-sm font-medium mt-1">{ad.title}</p>
      <p className="text-xs text-gray-500 mt-1">{ad.location}</p>
    </div>
  );
}