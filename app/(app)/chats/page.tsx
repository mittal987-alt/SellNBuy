"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

type Chat = {
  _id: string;
  ad: {
    title: string;
    images: string[];
  };
  otherUser: {
    name: string;
  };
};

export default function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/chats");
        setChats(res.data);
      } catch (err) {
        console.error("Failed to load chats");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) return <p className="p-6">Loading chats...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Your Chats</h1>

      {chats.length === 0 ? (
        <p className="text-gray-500">No conversations yet</p>
      ) : (
        <div className="space-y-3">
          {chats.map((chat) => (
            <Link
              key={chat._id}
              href={`/chats/${chat._id}`}
              className="flex items-center gap-4 border rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-neutral-800"
            >
              <img
                src={chat.ad.images?.[0] || "/placeholder.png"}
                className="h-14 w-14 object-cover rounded-lg"
              />

              <div>
                <p className="font-semibold">{chat.otherUser?.name || "User"}</p>
                 <p className="text-sm text-gray-500">{chat.ad.title}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
