"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { 
  FiMapPin, FiClock, FiHeart, FiMessageSquare, 
  FiPhone, FiShare2, FiChevronLeft, FiChevronRight, FiShield 
} from "react-icons/fi";

// ✅ UPDATED TYPE: location is now the GeoJSON object, locationName is the string
type Ad = {
  _id: string;
  title: string;
  price: number;
  description: string;
  locationName: string; // The city name string from backend
  location: { type: string; coordinates: number[] }; // The GeoJSON object
  yearsUsed: number;
  images: string[];
  user: { name: string; _id: string };
};

export default function AdDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await api.get(`/ads/${id}`);
        setAd(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAd();
  }, [id]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await api.post(`/ads/saved/${id}`);
      setSaved(res.data.saved);
    } catch (err) {
      alert("Failed to save ad");
    } finally {
      setSaving(false);
    }
  };

  const handleStartChat = async () => {
    try {
      const res = await api.post(`/chats/start/${ad?._id}`);
      router.push(`/chats/${res.data.chatId}`);
    } catch (err: any) {
      if (err?.response?.status === 401) alert("Please login first");
      else alert("Unable to start chat");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
    </div>
  );

  if (!ad) return <div className="p-20 text-center font-bold">Listing not found.</div>;

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <Link href="/ads" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
          <FiChevronLeft /> Back to Marketplace
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-[16/10] rounded-[3rem] overflow-hidden bg-slate-100 shadow-2xl group">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full"
              >
                <Image
                  src={ad.images?.[current] || "/placeholder.png"}
                  alt={ad.title}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {ad.images.length > 1 && (
              <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <NavBtn icon={<FiChevronLeft />} onClick={() => setCurrent(current === 0 ? ad.images.length - 1 : current - 1)} />
                <NavBtn icon={<FiChevronRight />} onClick={() => setCurrent(current === ad.images.length - 1 ? 0 : current + 1)} />
              </div>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/20 backdrop-blur-md p-2 rounded-full">
               {ad.images.map((_, i) => (
                 <div key={i} className={`h-1.5 rounded-full transition-all ${current === i ? "w-6 bg-white" : "w-1.5 bg-white/40"}`} />
               ))}
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {ad.images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setCurrent(i)}
                className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${current === i ? "border-blue-600 scale-95" : "border-transparent opacity-60 hover:opacity-100"}`}
              >
                <Image src={img} fill className="object-cover" alt="thumb" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-tight">
              {ad.title}
            </h1>
            <div className="flex items-center gap-6 text-slate-400 font-bold text-sm">
               {/* ✅ FIX: ad.locationName instead of ad.location */}
               <span className="flex items-center gap-1.5"><FiMapPin className="text-blue-600" /> {ad.locationName || "Remote"}</span>
               <span className="flex items-center gap-1.5"><FiClock className="text-blue-600" /> {ad.yearsUsed} Years Used</span>
            </div>
            <p className="text-5xl font-black text-blue-600 tracking-tighter pt-2">
              ₹{ad.price.toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={handleStartChat}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3"
            >
              <FiMessageSquare size={18} /> Start Conversation
            </button>
            
            <div className="flex gap-4">
              <button 
                onClick={handleSave}
                disabled={saving}
                className={`flex-1 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${saved ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                <FiHeart fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save Listing"}
              </button>
              <button className="px-8 py-5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
                <FiShare2 />
              </button>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Description</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              {ad.description}
            </p>
          </div>

          <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 flex gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                 <FiShield size={24} />
              </div>
              <div>
                 <h4 className="font-black text-xs uppercase tracking-widest text-blue-900">Bazaari Shield</h4>
                 <p className="text-[10px] font-bold text-blue-700/70 mt-1">Never pay in advance. Always meet the seller in a public place for inspection.</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavBtn({ icon, onClick }: { icon: any, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-900 shadow-xl hover:bg-blue-600 hover:text-white transition-all active:scale-90"
    >
      {icon}
    </button>
  );
}