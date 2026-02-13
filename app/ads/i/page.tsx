import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdDetailsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-6">

      {/* Image */}
      <img
        src="https://source.unsplash.com/600x400/?iphone"
        className="rounded-xl object-cover w-full"
      />

      {/* Details */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">
          iPhone 13 – Excellent Condition
        </h1>

        <p className="text-2xl font-semibold text-green-600">
          ₹ 45,000
        </p>

        <p className="flex items-center gap-2 text-gray-500">
          <MapPin size={16} /> Delhi
        </p>

        <p className="text-sm text-gray-600">
          Well maintained iPhone 13, no scratches, original charger included.
        </p>

        <Button className="w-full">
          Contact Seller
        </Button>
      </div>
    </div>
  );
}
