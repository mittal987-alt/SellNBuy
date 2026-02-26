"use client";

import { useState } from "react";
import Sidebar, { SidebarItemType } from "@/components/layout/sidebar";
import AdGrid from "@/components/ads/AdGrid";

const buyerSidebar: SidebarItemType[] = [
  { title: "Browse Ads", href: "/ads", icon: "🛒" },
  { title: "Saved Items", href: "/saved", icon: "❤️" },
  { title: "Chats", href: "/chats", icon: "💬" },
  { title: "My Profile", href: "/profile", icon: "👤" },
];

export default function BuyerDashboard() {
  const [search, setSearch] = useState("");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-12 gap-8">

        <aside className="hidden md:block md:col-span-3 lg:col-span-2">
          <div className="sticky top-24">
            <Sidebar items={buyerSidebar} />
          </div>
        </aside>

        <main className="col-span-12 md:col-span-9 lg:col-span-10 space-y-8">

          <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Section title="🔥 High Discount Deals">
            <AdGrid search={search} />
          </Section>

          <Section title="📍 Ads Near You">
            <AdGrid search={search} />
          </Section>

        </main>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-5">{title}</h2>
      {children}
    </section>
  );
}