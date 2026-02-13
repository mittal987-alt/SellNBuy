"use client";

import Sidebar, {
  SidebarItemType,
} from "@/components/layout/sidebar";
import AdGrid from "@/components/ads/AdGrid";

const buyerSidebar: SidebarItemType[] = [
  { title: "Browse Ads", href: "/ads", icon: "🛒" },
  { title: "Saved Items", href: "/saved", icon: "❤️" },
  { title: "Chats", href: "/chats", icon: "💬" },
  { title: "My Profile", href: "/profile", icon: "👤" },
];

export default function BuyerDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      <div className="grid grid-cols-12 gap-8">

        {/* SIDEBAR */}
        <aside className="hidden md:block md:col-span-3 lg:col-span-2">
          <div className="sticky top-24">
            <Sidebar items={buyerSidebar} />
          </div>
        </aside>

        {/* MAIN */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10 space-y-12">

          <Section title="🔥 High Discount Deals">
            <AdGrid />
          </Section>

          <Section title="📍 Ads Near You">
            <AdGrid />
          </Section>

        </main>
      </div>
    </div>
  );
}

/* ================= SECTIONS ================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-5">
        {title}
      </h2>
      {children}
    </section>
  );
}
