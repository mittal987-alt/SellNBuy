"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, user, authChecked } = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 Block logged-in users from login page
  useEffect(() => {
    if (authChecked && user) {
      if (user.role === "admin") {
        router.replace("/dashboard/admin");
      } else if (user.role === "seller") {
        router.replace("/dashboard/seller");
      } else {
        router.replace("/dashboard/buyer");
      }
    }
  }, [authChecked, user, router]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      setUser(res.data);

      // 🔁 Role-based redirect
      if (res.data.role === "admin") {
        router.replace("/dashboard/admin");
      } else if (res.data.role === "seller") {
        router.replace("/dashboard/seller");
      } else {
        router.replace("/dashboard/buyer");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black px-4">

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/10 p-8"
      >

        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-white">
            OLX
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            Login to continue
          </p>
        </div>

        {error && (
          <motion.p
            initial={{ x: -10 }}
            animate={{ x: 0 }}
            className="text-sm text-red-400 text-center mb-3"
          >
            {error}
          </motion.p>
        )}

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email address"
            className="bg-white/90"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            className="bg-white/90"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-6 bg-white text-black hover:bg-gray-200"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <div className="mt-6 text-center space-y-2">
          <Link
            href="/forgot-password"
            className="text-sm text-gray-300 hover:text-white"
          >
            Forgot password?
          </Link>

          <p className="text-sm text-gray-400">
            Don’t have an account?{" "}
            <Link href="/register" className="text-white font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
