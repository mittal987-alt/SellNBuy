"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { 
  FiPlus, FiEdit3, FiTrash2, FiMessageCircle, 
  FiEye, FiActivity, FiArrowUpRight, FiFilter
} from "react-icons/fi";

type Ad = {
  _id: string;
  title: string;
  price: number;
  images: string[];
};

export default function EnhancedSellerDashboard() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [filter, setFilter] = useState("all"); // all, active, sold

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const res = await api.get("/ads/my");
        setAds(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSellerData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20">
      
      {/* --- 🚀 TOP METRICS BOARD --- */}
      <div className="bg-white border-b border-slate-200 pt-12 pb-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black tracking-tighter italic uppercase text-slate-900">Console<span className="text-blue-600">.</span></h1>
              <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Performance & Inventory</p>
            </div>
            <Link
              href="/create-ad"
              className="group flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-slate-900 shadow-xl shadow-blue-200"
            >
              <FiPlus /> New Listing
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <InsightCard title="Total Revenue" value="₹42,800" trend="+12.5%" icon={<FiActivity />} color="blue" />
            <InsightCard title="Active Leads" value="14" trend="+3 new" icon={<FiMessageCircle />} color="indigo" />
            <InsightCard title="Ad Impressions" value="2.8k" trend="+18%" icon={<FiEye />} color="emerald" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-10">
        
        {/* --- 🛠️ INVENTORY CONTROLS --- */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-[2rem] border border-slate-200 shadow-xl mb-12">
          <div className="flex p-1 bg-slate-100 rounded-xl w-full md:w-auto">
            {["all", "active", "sold"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex-1 md:flex-none px-8 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === tab ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 px-4 w-full md:w-auto">
             <FiFilter className="text-slate-400" />
             <input 
               type="text" 
               placeholder="Search inventory..." 
               className="bg-transparent outline-none font-bold text-sm w-full"
             />
          </div>
        </div>

        {/* --- 📦 LISTINGS GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence>
            {ads.map((ad) => (
              <InventoryCard key={ad._id} ad={ad} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

interface InsightCardProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  color: string;
}

/* --- 🧊 INSIGHT CARD WITH MINI CHART --- */
function InsightCard({ title, value, trend, icon, color }: InsightCardProps) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-4 rounded-2xl bg-${color}-50 text-${color}-600 text-xl`}>
          {icon}
        </div>
        <div className="flex items-center gap-1 text-emerald-500 font-black text-xs">
          <FiArrowUpRight /> {trend}
        </div>
      </div>
      <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">{title}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
        {/* MINI SPARKLINE SVG */}
        <svg className="w-20 h-10 text-blue-200" viewBox="0 0 100 40">
           <path d="M0 35 Q 20 10, 40 25 T 80 5 T 100 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

interface InventoryCardProps {
  ad: Ad;
}

/* --- 📋 ROW-STYLE INVENTORY CARD --- */
function InventoryCard({ ad }: InventoryCardProps) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex gap-6 bg-white p-5 rounded-[2.5rem] border border-slate-100 hover:border-blue-200 transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
    >
      <div className="relative w-40 h-40 rounded-[1.8rem] overflow-hidden flex-shrink-0">
        <Image src={ad.images?.[0] || "/placeholder.png"} width={160} height={160} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase">Live</div>
      </div>

      <div className="flex-1 flex flex-col justify-between py-2">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-black text-lg text-slate-900 line-clamp-1">{ad.title}</h3>
            <p className="text-xl font-black text-blue-600 tracking-tighter">₹{ad.price.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
               <FiEye /> 1,240 views
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
               <FiMessageCircle /> 8 chats
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href={`/dashboard/seller/edit/${ad._id}`} className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-colors">
            <FiEdit3 /> Edit
          </Link>
          <button className="px-5 border border-slate-200 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all">
            <FiTrash2 />
          </button>
        </div>
      </div>
    </motion.div>
  );
}