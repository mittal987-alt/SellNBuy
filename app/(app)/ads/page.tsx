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
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [sort, setSort] = useState("");

  /* ================= FETCH ADS ================= */

  const fetchAds = async (pageNumber: number, reset = false) => {
    try {
      setLoading(true);

      const res = await api.get("/ads", {
        params: {
          page: pageNumber,
          search,
          city,
          min,
          max,
          sort,
        },
      });

      const newAds = res.data.ads;
      setTotalPages(res.data.totalPages);

      if (reset) {
        setAds(newAds);
      } else {
        setAds((prev) => [...prev, ...newAds]);
      }
    } catch (err) {
      console.error("Failed to load ads", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    fetchAds(1, true);
  }, []);

  /* ================= PAGE CHANGE ================= */

  useEffect(() => {
    if (page > 1) {
      fetchAds(page);
    }
  }, [page]);

  /* ================= INFINITE SCROLL ================= */

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200 &&
        !loading &&
        page < totalPages
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, page, totalPages]);

  /* ================= APPLY FILTER ================= */

  const applyFilters = () => {
    setPage(1);
    fetchAds(1, true); // 👈 fetch page 1 manually
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">

      {/* 🔎 SIDEBAR */}
      <aside className="col-span-12 md:col-span-3 space-y-4">
        <div className="space-y-3 border rounded-xl p-4 bg-white dark:bg-neutral-900">

          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />

          <input
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />

          <input
            placeholder="Min Price"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />

          <input
            placeholder="Max Price"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          >
            <option value="">Newest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>

          <button
            onClick={applyFilters}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
          >
            Apply Filters
          </button>
        </div>
      </aside>

      {/* 🛒 ADS GRID */}
      <main className="col-span-12 md:col-span-9">

        {ads.length === 0 && !loading ? (
          <div className="rounded-xl border p-6 text-center text-gray-500 bg-white dark:bg-neutral-900">
            No ads available
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {ads.map((ad) => (
                <AdCard key={ad._id} ad={ad} />
              ))}
            </div>

            {loading && (
              <p className="text-center mt-6 text-gray-500">
                Loading more ads...
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

/* ================= CARD ================= */

function AdCard({ ad }: { ad: Ad }) {
  return (
    <Link
      href={`/ads/${ad._id}`}
      className="rounded-2xl border bg-white dark:bg-neutral-900 hover:shadow-md transition block"
    >
      <div className="h-36 bg-gray-100 dark:bg-neutral-800 rounded-t-2xl overflow-hidden">
        <img
          src={ad.images?.[0] || "/placeholder.png"}
          className="w-full h-full object-cover"
          alt="ad"
        />
      </div>

      <div className="p-4">
        <p className="font-bold text-green-600">₹ {ad.price}</p>
        <p className="text-sm font-medium mt-1">{ad.title}</p>
        <p className="text-xs text-gray-500">{ad.location}</p>
      </div>
    </Link>
  );
}