"use client";

import { useState } from "react";
import AdGrid from "@/components/ads/AdGrid";
import {
  FiNavigation, FiSearch
} from "react-icons/fi";

export default function NearbyPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-blue-100">
      
      <div className="max-w-[1700px] mx-auto px-8 py-12">
        
        {/* 🔍 SEARCH BAR */}
        <div className="relative group mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-[2.5rem] blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative flex flex-col xl:flex-row items-center justify-between gap-8 bg-white p-10 rounded-[2.5rem] border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
            <div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 flex items-center gap-4">
                <FiNavigation className="text-emerald-600" />
                Nearby Ads
              </h1>
              <p className="text-slate-500 font-medium mt-2">Discover products within 100 meters of your location.</p>
            </div>
            <div className="relative w-full xl:max-w-md">
              <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-900" size={22} />
              <input
                type="text"
                placeholder="Search nearby ads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border-2 border-slate-900 outline-none focus:ring-4 focus:ring-blue-500/10 font-black text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* 🌟 NEARBY ADS SECTION */}
        <section className="relative group p-10 rounded-[3.5rem] bg-emerald-50/50 border border-emerald-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] hover:bg-white">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                <FiNavigation className="text-emerald-600" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter">Ads Near You</h2>
            </div>
          </div>
          <div className="relative z-10">
            <AdGrid search={search} type="nearby" hoverEffect="lift" />
          </div>
        </section>

      </div>
    </div>
  );
}
