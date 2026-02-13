"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";

export default function EditAdPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [yearsUsed, setYearsUsed] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  /* ---------------- FETCH AD ---------------- */

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await api.get(`/ads/${id}`);

        const ad = res.data;

        setTitle(ad.title);
        setPrice(ad.price.toString());
        setDescription(ad.description || "");
        setLocation(ad.location || "");
        setYearsUsed(ad.yearsUsed?.toString() || "");
        setImages(ad.images || []);
      } catch (err) {
        console.error("Failed to load ad", err);
        alert("Failed to load ad");
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id]);

  /* ---------------- IMAGE UPLOAD ---------------- */

  const handleImageUpload = async (files: FileList) => {
    setUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("file", file);
      });

      const res = await api.post("/upload", formData);

      // backend returns { url: "" }
      setImages((prev) => [...prev, res.data.url]);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- REMOVE IMAGE ---------------- */

  const removeImage = (img: string) => {
    setImages((prev) => prev.filter((i) => i !== img));
  };

  /* ---------------- UPDATE AD ---------------- */

  const handleUpdate = async () => {
    if (!title || !price || !location) {
      alert("Please fill required fields");
      return;
    }

    try {
      setSaving(true);

      await api.put(`/ads/${id}`, {
        title,
        price: Number(price),
        description,
        location,
        yearsUsed: Number(yearsUsed),
        images,
      });

      alert("Ad updated successfully");
      router.push("/dashboard/seller");
      router.refresh();
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update ad");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Edit Ad</h1>

      <div className="space-y-4 rounded-xl border p-6 bg-white dark:bg-neutral-900">

        <input
          placeholder="Ad title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          type="number"
          placeholder="Years Used"
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
            multiple
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                handleImageUpload(e.target.files);
              }
            }}
          />

          {uploading && (
            <p className="text-sm text-gray-500 mt-2">
              Uploading images...
            </p>
          )}

          <div className="grid grid-cols-3 gap-3 mt-3">
            {images.map((img) => (
              <div key={img} className="relative">
                <img
                  src={img}
                  className="h-24 w-full object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(img)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleUpdate}
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
        >
          {saving ? "Updating..." : "Update Ad"}
        </button>
      </div>
    </div>
  );
}
