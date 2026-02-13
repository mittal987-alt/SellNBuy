"use client";

import { useUserStore } from "@/store/userStore";

export default function SettingsPage() {
  const user = useUserStore((s) => s.user);

  if (!user) return null;

  return (
    <div className="max-w-xl space-y-6">

      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="rounded-xl border p-6 bg-white dark:bg-neutral-900 space-y-3">
        <p>
          <span className="text-gray-500">Name:</span>{" "}
          <strong>{user.name}</strong>
        </p>
        <p>
          <span className="text-gray-500">Role:</span>{" "}
          <strong>{user.role}</strong>
        </p>
      </div>

    </div>
  );
}
