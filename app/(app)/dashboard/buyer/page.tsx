"use client";

import { useState } from "react";
import AdGrid from "@/components/ads/AdGrid";
import {
  FiHeart, FiStar, FiMonitor, FiTruck, FiHome, 
  FiShoppingBag, FiSearch, FiZap, FiNavigation, FiArrowRight

} from "react-icons/fi";

export default function BuyerDashboard() {
  const [search, setSearch] = useState("");

  const categories = [
    { name: "Electronics", icon: FiMonitor, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Vehicles", icon: FiTruck, color: "text-indigo-600", bg: "bg-indigo-50" },
    { name: "Real Estate", icon: FiHome, color: "text-emerald-600", bg: "bg-emerald-50" },
    { name: "Fashion", icon: FiShoppingBag, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-blue-100">
      
      <div className="max-w-[1700px] mx-auto grid grid-cols-12 gap-10 px-8 py-12">
        
        {/* --- 🏰 SIDEBAR --- */}
        <aside className="hidden lg:block lg:col-span-2">
          <div className="sticky top-12 space-y-12">
            <div className="flex items-center gap-3 px-2">
              <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black italic shadow-2xl shadow-slate-900/20">B</div>
              <span className="text-2xl font-black tracking-tighter uppercase">Bazaari</span>
            </div>

            <nav className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 px-4 mb-6">Discovery</p>
              {categories.map((cat) => (
                <button key={cat.name} className="group flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 border border-transparent hover:border-slate-100">
                  <div className={`p-2.5 rounded-xl ${cat.bg} transition-transform group-hover:scale-110`}>
                    <cat.icon className={`${cat.color} text-lg`} />
                  </div>
                  <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{cat.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* --- 🚀 MAIN CONTENT --- */}
        <main className="col-span-12 lg:col-span-10 space-y-12">
          
          {/* 🔍 THE BOLD SEARCH BAR */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-[2.5rem] blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative flex flex-col xl:flex-row items-center justify-between gap-8 bg-white p-10 rounded-[2.5rem] border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
              <div>
                <h1 className="text-5xl font-black tracking-tighter text-slate-900">The Curation.</h1>
                <p className="text-slate-500 font-medium mt-2">Premium deals tailored for your lifestyle.</p>
              </div>
              <div className="relative w-full xl:max-w-md">
                <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-900" size={22} />
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border-2 border-slate-900 outline-none focus:ring-4 focus:ring-blue-500/10 font-black text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* 🌟 SECTIONS WITH SHADOW EFFECTS */}
          <div className="space-y-12">
            
            <Section 
              title="Daily Highlights" 
              icon={<FiStar className="text-blue-600" fill="currentColor" />} 
              bgColor="bg-blue-50/50" 
              borderColor="border-blue-100"
            >
              <AdGrid search={search} layout="horizontal" hoverEffect="lift" />
            </Section>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              <Section 
                title="Wishlist" 
                icon={<FiHeart className="text-rose-500" fill="currentColor" />} 
                bgColor="bg-rose-50/50" 
                borderColor="border-rose-100"
              >
                <AdGrid search={search} type="saved" limit={2} hoverEffect="lift" />
              </Section>

              <Section 
                title="Nearby" 
                icon={<FiNavigation className="text-emerald-600" />} 
                bgColor="bg-emerald-50/50" 
                borderColor="border-emerald-100"
              >
                <AdGrid search={search} type="nearby" limit={2} hoverEffect="lift" />
              </Section>
            </div>

            <Section 
              title="Hyper Trending" 
              icon={<FiZap className="text-amber-500" fill="currentColor" />} 
              bgColor="bg-amber-50/50" 
              borderColor="border-amber-100"
            >
              <AdGrid search={search} type="trending" hoverEffect="lift" />
            </Section>
          </div>

        </main>
      </div>
    </div>
  );
}

/* --- 🧊 ENHANCED SECTION COMPONENT --- */
interface SectionProps {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  children: React.ReactNode;
}

function Section({ title, icon, bgColor, borderColor, children }: SectionProps) {
  return (
    <section className={`relative group p-10 rounded-[3.5rem] ${bgColor} border ${borderColor} shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] hover:bg-white`}>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <h2 className="text-3xl font-black tracking-tighter">{title}</h2>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 flex items-center gap-2">
          See All <FiArrowRight />
        </button>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}