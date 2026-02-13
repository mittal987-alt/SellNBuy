"use client";

import Link from "next/link";
import { useUserStore } from "@/store/userStore";
import api from "@/lib/api";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function Navbar() {
  const user = useUserStore((s) => s.user);
  const clearUser = useUserStore((s) => s.clearUser);

  const handleLogout = async () => {
    await api.post("/auth/logout");
    clearUser();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-blue-600 dark:text-blue-400"
        >
          OLX
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {user ? (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                Hi, {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="text-rose-500 hover:text-rose-600 text-sm font-medium transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-full transition shadow"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
