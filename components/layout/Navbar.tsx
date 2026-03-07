"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useUserStore } from "@/store/userStore";
import api from "@/lib/api";
import ThemeToggle from "@/components/common/ThemeToggle";
import DynamicIcon from "@/components/common/DynamicIcon";

const FiMenu = dynamic(() => import("react-icons/fi").then((m) => m.FiMenu), { ssr: false });
const FiX = dynamic(() => import("react-icons/fi").then((m) => m.FiX), { ssr: false });
const FiSearch = dynamic(() => import("react-icons/fi").then((m) => m.FiSearch), { ssr: false });
const FiBell = dynamic(() => import("react-icons/fi").then((m) => m.FiBell), { ssr: false });
const FiUser = dynamic(() => import("react-icons/fi").then((m) => m.FiUser), { ssr: false });
const FiLogOut = dynamic(() => import("react-icons/fi").then((m) => m.FiLogOut), { ssr: false });

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = useUserStore((s) => s.user);
  const clearUser = useUserStore((s) => s.clearUser);

  const handleLogout = async () => {
    await api.post("/auth/logout");
    clearUser();
    router.push("/");
  };

  const navItems = [
    { title: "Home", href: "/", icon: "FiHome" },
    { title: "Saved", href: "/saved", icon: "FiHeart" },
    { title: "Chat", href: "/chat", icon: "FiMessageCircle" },
    { title: "My Ads", href: "/my-ads", icon: "FiPackage" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-neutral-950/80 border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold text-blue-600 dark:text-blue-400"
        >
          OLX
        </Link>

        {/* Search */}
        <div className="hidden md:flex items-center bg-gray-100 dark:bg-neutral-800 rounded-full px-4 py-2 w-80">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            placeholder="Search products..."
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition",
                  "hover:bg-gray-100 dark:hover:bg-neutral-800",
                  active && "text-blue-600"
                )}
              >
                <DynamicIcon iconName={item.icon} />
                {item.title}

                {active && (
                  <motion.div
                    layoutId="navbar"
                    className="absolute inset-0 rounded-lg bg-blue-100 dark:bg-blue-900/30 -z-10"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          <ThemeToggle />

          {/* Notification */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800">
            <FiBell size={18} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
              3
            </span>
          </button>

          {user ? (
            <>
              {/* Avatar */}
              <div className="flex items-center gap-2 text-sm font-medium">
                <FiUser />
                {user.name}
              </div>

              <Link
                href="/sell"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
              >
                Sell
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-rose-500 hover:text-rose-600"
              >
                <FiLogOut />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm"
              >
                Register
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t p-4 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 text-sm font-medium"
            >
              <DynamicIcon iconName={item.icon} />
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}