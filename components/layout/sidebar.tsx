"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export type SidebarItemType = {
  title: string;
  href: string;
  icon: string;
};

export default function Sidebar({ items }: { items: SidebarItemType[] }) {
  const pathname = usePathname();

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex items-center gap-3 rounded-xl px-4 py-3 border transition font-medium",
              "bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800",
              isActive &&
                "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20"
            )}
            
          >
            <span className="text-xl">{item.icon}</span>
            {item.title}
          </Link>
        );
      })}
    </div>
  );
}
