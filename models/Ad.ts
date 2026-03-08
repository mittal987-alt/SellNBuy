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
        type: [Number], // MUST BE [longitude, latitude]
        required: true,
      },
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Explicitly index the coordinates field for geospatial queries
AdSchema.index({ "location.coordinates": "2dsphere" });

export default mongoose.models.Ad || mongoose.model("Ad", AdSchema);