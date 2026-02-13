"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/userStore";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, user, authChecked } = useUserStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 Block logged-in users from register page
  useEffect(() => {
    if (authChecked && user) {
      router.replace("/dashboard/buyer");
    }
  }, [authChecked, user, router]);

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      setUser(res.data);

      // 🟢 New users always start as buyer
      router.replace("/dashboard/buyer");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) return null;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-center">
        Create Account
      </h1>

      {error && (
        <p className="text-sm text-red-500 text-center">
          {error}
        </p>
      )}

      <Input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        className="w-full"
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? "Creating..." : "Register"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600">
          Login
        </Link>
      </p>
    </div>
  );
}
