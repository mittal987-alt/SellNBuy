"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import link from "next/link";
export default function CreateAdPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [yearsUsed, setYearsUsed] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  /* ---------------- IMAGE UPLOAD ---------------- */

  const handleImageUpload = async (files: FileList) => {
    setUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("file", file);
      });

      const res = await api.post("/upload", formData);

      // ✅ backend returns { urls: [] }
      setImages((prev) => [...prev, ...res.data.urls]);
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- SUBMIT AD ---------------- */

  const handleSubmit = async () => {
    if (!title || !price || !location || !category) {
      alert("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      await api.post("/ads", {
        title,
        price: Number(price),
        description,
        location,
        category,
        yearsUsed: Number(yearsUsed),
        images, // ✅ VERY IMPORTANT
      });

      router.push("/dashboard/seller");
      router.refresh();
    } catch (err) {
      console.error("Create ad failed", err);
      alert("Failed to publish ad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 px-4 py-6">
      <h1 className="text-2xl font-bold">Post New Ad</h1>

      <div className="space-y-4 rounded-xl border p-6 bg-white dark:bg-neutral-900">

        <input
          placeholder="Ad title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          placeholder="Price (₹)"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          placeholder="Location (City)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">Select category</option>
          <option value="Cars">Cars</option>
          <option value="Property">Property</option>
          <option value="Mobiles">Mobiles</option>
          <option value="Fashion">Fashion</option>
          <option value="Jobs">Jobs</option>
          <option value="Furniture">Furniture</option>
        </select>

        <input
          placeholder="Years Used"
          type="number"
          value={yearsUsed}
          onChange={(e) => setYearsUsed(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 min-h-[120px]"
        />

        {/* IMAGE UPLOAD */}
        <div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                handleImageUpload(e.target.files);
              }
            }}
          />

          {uploading && (
            <p className="text-sm text-gray-500 mt-1">
              Uploading images...
            </p>
          )}

          <div className="grid grid-cols-3 gap-3 mt-3">
            {images.map((img) => (
              <img
                key={img}
                src={img}
                className="h-24 w-full object-cover rounded-lg"
                alt="ad"
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
        >
          {loading ? "Publishing..." : "Publish Ad"}
        </button>
      </div>
    </div>
  );
}
