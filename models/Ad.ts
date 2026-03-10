import mongoose from "mongoose";

const AdSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, default: "" },
    locationName: { type: String, default: "Unknown" },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    images: { type: [String], default: [] },

    // ⭐ ADD THIS
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Geo index
AdSchema.index({ location: "2dsphere" });

export default mongoose.models.Ad || mongoose.model("Ad", AdSchema);