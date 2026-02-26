"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

type Ad = {
  _id: string;
  title: string;
  price: number;
  description: string;
  location: string;
  yearsUsed: number;
  images: string[];
  user: string;
  savedBy?: string[];
};

export default function AdDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  /* ================= FETCH AD ================= */

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

  /* ================= SAVE AD ================= */

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await api.post(`/ads/saved/${id}`);
      setSaved(res.data.saved);
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save ad");
    } finally {
      setSaving(false);
    }
  };

  /* ================= START CHAT ================= */

  const handleStartChat = async () => {
    try {
      const res = await api.post(`/chats/start/${ad?._id}`);
      router.push(`/chats/${res.data.chatId}`);
    } catch (err: any) {
      console.error("Chat error", err);

      if (err?.response?.status === 401)
        alert("Please login first");
      else if (err?.response?.status === 400)
        alert("You cannot chat with your own ad");
      else
        alert("Unable to start chat");
    }
  };

  /* ================= IMAGE NAV ================= */

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

      {/* ================= IMAGE SECTION ================= */}
      <div>
        <div className="relative h-[450px] rounded-2xl overflow-hidden bg-gray-100">
          <img
            src={ad.images?.[current] || "/placeholder.png"}
            className="w-full h-full object-cover"
            alt="ad"
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
        <div className="flex gap-3 mt-4 flex-wrap">
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

      {/* ================= DETAILS SECTION ================= */}
      <div className="space-y-6">

        <h1 className="text-3xl font-bold">{ad.title}</h1>

        <p className="text-3xl font-bold text-green-600">
          ₹ {ad.price}
        </p>

        <div className="space-y-2 text-gray-600">
          <p>📍 {ad.location}</p>
          <p>🕒 {ad.yearsUsed} years used</p>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full border rounded-lg py-3 font-medium hover:bg-gray-100 transition"
        >
          {saved ? "❤️ Saved" : "🤍 Save Ad"}
        </button>

        {/* CONTACT BUTTON */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition">
          📞 Contact Seller
        </button>

        {/* CHAT BUTTON */}
        <button
          onClick={handleStartChat}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition"
        >
          💬 Start Chat
        </button>

        <hr />

        <div>
          <h2 className="text-lg font-semibold mb-2">
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {ad.description}
          </p>
        </div>

      </div>
    </div>
  );
}
