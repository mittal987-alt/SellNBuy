"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import api from "@/lib/api";
import {
  FiPlus, FiEdit3, FiTrash2, FiMessageCircle, FiEye, FiActivity,
  FiArrowUpRight, FiFilter, FiPackage, FiStar, FiMoreVertical
} from "react-icons/fi";

export default function EnhancedSellerDashboard() {
  const [ads, setAds] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const res = await api.get("/ads/my");
        setAds(res.data);
      } catch (err) { console.error(err); }
    };
    fetchSellerData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/ads/${id}`);
      setAds((prev) => prev.filter((ad) => ad._id !== id));
    } catch (err) { alert("Failed to delete ad"); }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 pb-20 font-sans selection:bg-blue-100">
      
      {/* --- 🚀 HERO SECTION --- */}
      <div className="bg-white border-b border-slate-100 pt-16 pb-24 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-blue-400/10 rounded-full blur-[100px]" />
        
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Seller Dashboard</span>
              <h1 className="text-5xl font-black tracking-tighter italic uppercase text-slate-900 leading-none">
                Console<span className="text-blue-600">.</span>
              </h1>
            </motion.div>

            <div className="flex gap-4">
              <Link
                href="/create-ad"
                className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl hover:-translate-y-1 active:scale-95"
              >
                <FiPlus className="group-hover:rotate-90 transition-transform" /> New Listing
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <InsightCard title="Revenue" value="₹42.8k" trend="+12%" icon={<FiActivity />} color="blue" />
            <InsightCard title="Leads" value="14" trend="+3" icon={<FiMessageCircle />} color="indigo" />
            <InsightCard title="Views" value="2.8k" trend="+18%" icon={<FiEye />} color="emerald" />
            <InsightCard title="Rating" value="4.9" trend="Top" icon={<FiStar />} color="amber" />
          </div>
        </div>
      </div>

      {/* --- 🛠️ INVENTORY CONTROL --- */}
      <div className="max-w-7xl mx-auto px-8 -mt-12 relative z-20">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/80 backdrop-blur-xl p-4 rounded-[2.5rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.05)] mb-12">
          <div className="flex p-1 bg-slate-100/50 rounded-2xl relative">
            <LayoutGroup>
              {["all", "active", "sold"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`relative px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors z-10 ${
                    filter === tab ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {filter === tab && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white rounded-xl shadow-md z-[-1]" 
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {tab}
                </button>
              ))}
            </LayoutGroup>
          </div>

          <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl transition-all ${isSearching ? 'bg-slate-50 w-full md:w-80' : 'w-full md:w-64'}`}>
            <FiFilter className={isSearching ? 'text-blue-600' : 'text-slate-400'} />
            <input
              onFocus={() => setIsSearching(true)}
              onBlur={() => setIsSearching(false)}
              type="text"
              placeholder="Search by title..."
              className="bg-transparent outline-none font-bold text-xs w-full placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* --- 📦 LISTINGS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {ads.length > 0 ? ads.map((ad, idx) => (
              <InventoryCard key={ad._id} ad={ad} index={idx} onDelete={handleDelete} />
            )) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100"
              >
                <FiPackage className="mx-auto text-4xl text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No listings found in your inventory</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ================= INSIGHT CARD ================= */

function InsightCard({ title, value, trend, icon, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm transition-shadow hover:shadow-2xl hover:shadow-slate-100"
    >
      <div className="flex justify-between items-center mb-6">
        <div className={`p-4 rounded-2xl ${colors[color]} text-xl`}>
          {icon}
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full flex items-center gap-1 text-[10px] font-black">
          <FiArrowUpRight /> {trend}
        </div>
      </div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-black tracking-tighter text-slate-900">{value}</h3>
    </motion.div>
  );
}

/* ================= INVENTORY CARD ================= */

function InventoryCard({ ad, onDelete, index }: any) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      className="group flex flex-col sm:flex-row gap-6 bg-white p-5 rounded-[2.5rem] border border-slate-100 hover:border-blue-100 transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] relative"
    >
      <div className="relative w-full sm:w-44 aspect-square rounded-[1.8rem] overflow-hidden bg-slate-50 shrink-0">
        <Image
          src={ad.images?.[0] || "/placeholder.png"}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          alt=""
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
           Live
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between py-2">
        <div className="space-y-1">
          <div className="flex justify-between items-start">
            <h3 className="font-black text-xl text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
              {ad.title}
            </h3>
            <button className="text-slate-300 hover:text-slate-900 p-1">
              <FiMoreVertical />
            </button>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tighter italic">
            ₹{ad.price.toLocaleString()}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 my-4 border-y border-slate-50 py-3">
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">Views</span>
            <span className="text-xs font-bold flex items-center gap-1"><FiEye className="text-blue-500" /> 1,240</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">Chats</span>
            <span className="text-xs font-bold flex items-center gap-1"><FiMessageCircle className="text-emerald-500" /> 8</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/dashboard/seller/edit/${ad._id}`}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-100"
          >
            <FiEdit3 /> Manage Listing
          </Link>
          <button
            onClick={() => onDelete(ad._id)}
            className="w-14 flex items-center justify-center border border-slate-100 rounded-2xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all active:scale-95"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </motion.div>
  );
}