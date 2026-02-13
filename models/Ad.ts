import mongoose from "mongoose";

const AdSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "Unknown",
    },
    yearsUsed: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images :{
        type: [String], // array of image URLs
        default: []
    },
  },
  { timestamps: true }
);

export default mongoose.models.Ad || mongoose.model("Ad", AdSchema);
