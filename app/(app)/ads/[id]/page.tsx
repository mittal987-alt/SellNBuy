"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

type Ad = {
  _id: string;
  title: string;
  price: number;
  description: string;
  location: string;
  yearsUsed: number;
  images: string[];
};

export default function AdDetailsPage() {
  const { id } = useParams();
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await api.get(`/ads/${id}`);
        setAd(res.data);
      } catch (err) {
        console.error("Failed to fetch ad", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAd();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!ad) return <p className="p-6">Ad not found</p>;

  const next = () =>
    setCurrent((prev) =>
      prev === ad.images.length - 1 ? 0 : prev + 1
    );

  const prev = () =>
    setCurrent((prev) =>
      prev === 0 ? ad.images.length - 1 : prev - 1
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-10">

      {/* IMAGE SECTION */}
      <div>
        <div className="relative h-[450px] w-[] rounded-2xl overflow-hidden bg-gray-100">
          <img
            src={ad.images?.[current] || "/placeholder.png"}
            className="w-full h-full object-cover"
          />

          {ad.images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-1 rounded"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-1 rounded"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* THUMBNAILS */}
        <div className="flex gap-3 mt-4">
          {ad.images.map((img, index) => (
            <img
              key={index}
              src={img}
              onClick={() => setCurrent(index)}
              className={`h-20 w-20 object-cover rounded cursor-pointer border ${
                current === index ? "border-blue-600" : ""
              }`}
            />
          ))}
        </div>
      </div>

      {/* DETAILS SECTION */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{ad.title}</h1>

        <p className="text-2xl font-bold text-green-600">
          ₹ {ad.price}
        </p>

        <p className="text-gray-600">
          📍 {ad.location}
        </p>

        <p className="text-gray-600">
          🕒 {ad.yearsUsed} years used
        </p>

        <hr />

        <p className="text-gray-700">
          {ad.description}
        </p>
      </div>
    </div>
  );
}
