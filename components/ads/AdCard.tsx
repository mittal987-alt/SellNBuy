"use client";

type Ad = {
  id: number;
  title: string;
  price: string;
  location: string;
  image: string;
};
const handleSave = async () => {
  await api.post(`/ads/saved/${ad._id}`);
};


export default function AdCard({ ad }: { ad: Ad }) {
  return (
    <div
      className="
        rounded-xl border
        bg-white dark:bg-neutral-900
        text-black dark:text-white
        overflow-hidden
        transition-shadow hover:shadow-lg
      "
    >
      {/* Image */}
      <div className="h-36 md:h-44 bg-gray-100 dark:bg-neutral-800">
        <img
          src={ad.image}
          alt={ad.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/400x300?text=No+Image";
          }}
        />
      </div>

      {/* Content */}
      <div className="p-3 space-y-1">
        <p className="font-bold text-green-600">
          ₹ {ad.price}
        </p>

        <h3 className="text-sm font-medium line-clamp-2">
          {ad.title}
        </h3>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          {ad.location}
        </p>
        <button
  onClick={handleSave}
  className="text-red-500 text-sm"
>
  ❤️ Save
</button>

      </div>
    </div>
  );
}
