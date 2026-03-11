"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

type Chat = {
  _id: string;
  buyer: {
    _id: string;
    name: string;
  };
  seller: {
    _id: string;
    name: string;
  };
  lastMessage: string;
};

export default function MessagesPage() {

  const [chats, setChats] = useState<Chat[]>([]);

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId")
      : null;

  useEffect(() => {

    const loadChats = async () => {

      try {

        const res = await api.get("/chats");

        setChats(res.data);

      } catch (err) {
        console.log("Failed to load chats");
      }

    };

    loadChats();

  }, []);

  return (

    <div className="max-w-2xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Messages
      </h1>

      {chats.length === 0 && (
        <p className="text-gray-500">
          No messages yet
        </p>
      )}

      {chats.map((chat) => {

        const otherUser =
          chat.buyer?._id === userId
            ? chat.seller
            : chat.buyer;

        return (

          <Link
            key={chat._id}
            href={`/chats/${chat._id}`}
          >

            <div className="border p-4 rounded-lg mb-3 hover:bg-gray-50 cursor-pointer">

              <p className="font-semibold">
                {otherUser?.name || "User"}
              </p>

              <p className="text-gray-500 text-sm">

                {chat.lastMessage || "Start conversation"}

              </p>

            </div>

          </Link>

        );

      })}

    </div>

  );

}