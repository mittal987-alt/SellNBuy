"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiArrowLeft, FiCamera, FiTag, FiMapPin, 
  FiGrid, FiCheck, FiInfo, FiX, FiHeart
} from "react-icons/fi";

export default function CreateAdPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    location: "",
    category: "",
    yearsUsed: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (files: FileList) => {
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("file", file));
      const res = await api.post("/upload", formData);
      setImages((prev) => [...prev, ...res.data.urls]);
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.location || !form.category) {
      alert("Please fill required fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/ads", {
        ...form,
        price: Number(form.price),
        yearsUsed: Number(form.yearsUsed),
        images,
      });
      router.push("/dashboard/seller");
      router.refresh();
    } catch {
      alert("Failed to publish ad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 pb-20">
      
      {/* 🌌 HEADER */}
      <div className="max-w-7xl mx-auto px-8 py-10 flex items-center justify-between">
        <Link href="/dashboard/seller" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Exit Studio
        </Link>
        <div className="text-center">
            <h1 className="text-3xl font-black tracking-tighter italic">Studio<span className="text-blue-600">.</span></h1>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">New Listing Creation</p>
        </div>
        <div className="w-20"></div> {/* Spacer */}
      </div>

      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* --- 📝 FORM SECTION --- */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* STEP 1: IDENTITY */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">01</div>
               <h2 className="text-xl font-black tracking-tight">Essential Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PremiumInput label="Listing Title" placeholder="e.g. iPhone 15 Pro Max" value={form.title} onChange={(v: string) => setForm({...form, title: v})} icon={<FiTag />} />
              <PremiumInput label="Price (₹)" type="number" placeholder="0.00" value={form.price} onChange={(v: string) => setForm({...form, price: v})} icon={<span className="font-bold text-xs">₹</span>} />
              <PremiumInput label="Location" placeholder="Delhi, Mumbai..." value={form.location} onChange={(v: string) => setForm({...form, location: v})} icon={<FiMapPin />} />
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Category</label>
                <div className="relative">
                  <FiGrid className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select 
                    value={form.category} 
                    onChange={(e) => setForm({...form, category: e.target.value})}
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm outline-none focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none font-bold"
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Vehicles">Vehicles</option>
                    <option value="Property">Property</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* STEP 2: MEDIA */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">02</div>
               <h2 className="text-xl font-black tracking-tight">Gallery & Visuals</h2>
            </div>

            <div className="relative group border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 transition-all hover:border-blue-400 hover:bg-blue-50/30">
              <input 
                type="file" multiple accept="image/*" 
                onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                   <FiCamera size={24} />
                </div>
                <p className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Click or Drag to Upload</p>
                <p className="text-slate-400 text-xs mt-2 font-medium">PNG, JPG or WEBP (Max 5MB per file)</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <AnimatePresence>
                {images.map((img, i) => (
                  <motion.div key={i} layout initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative aspect-square rounded-2xl overflow-hidden group">
                    <Image src={img} width={200} height={200} className="w-full h-full object-cover" alt="" />
                    <button onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1 bg-white rounded-full text-rose-500 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiX size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* --- 🖼️ PREVIEW SECTION --- */}
        <div className="lg:col-span-5">
           <div className="sticky top-10 space-y-8">
              <div className="bg-slate-900 rounded-[3rem] p-10 text-white overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 blur-[80px] opacity-40"></div>
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-10">Live Marketplace Preview</h3>
                 
                 {/* MINI AD CARD PREVIEW */}
                 <div className="bg-white rounded-[2rem] p-4 text-slate-900 shadow-2xl">
                    <div className="aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden mb-4 relative">
                       {images[0] ? <Image src={images[0]} width={400} height={300} className="w-full h-full object-cover" alt="Product preview" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><FiCamera size={32} /></div>}
                       <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-2 rounded-full text-rose-500 shadow-sm"><FiHeart fill="currentColor" size={12}/></div>
                    </div>
                    <div className="px-1 space-y-1">
                       <p className="text-2xl font-black tracking-tighter">₹{form.price || "0"}</p>
                       <h4 className="font-bold text-lg truncate">{form.title || "Untitled Product"}</h4>
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest pt-2">
                          <FiMapPin className="text-blue-600" /> {form.location || "Location Unknown"}
                       </div>
                    </div>
                 </div>

                 <button 
                   onClick={handleSubmit} 
                   disabled={loading || uploading}
                   className="w-full mt-10 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900 transition-all flex items-center justify-center gap-3"
                 >
                   {loading ? "Publishing Listing..." : <><FiCheck /> Launch Ad</>}
                 </button>
              </div>

              <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex gap-4">
                 <FiInfo className="text-blue-600 mt-1 shrink-0" />
                 <p className="text-xs font-medium text-blue-800 leading-relaxed">
                   Ads with clear titles and multiple photos sell **3x faster** on Bazaari. Ensure your lighting is bright!
                 </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

interface PremiumInputProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  [key: string]: unknown;
}

/* --- 🧊 PREMIUM INPUT COMPONENT --- */
function PremiumInput({ label, icon, value, onChange, ...props }: PremiumInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{label}</label>
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
          {icon}
        </div>
        <input 
          {...props} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all font-bold placeholder:font-medium placeholder:text-slate-300" 
        />
      </div>
    </div>
  );
}