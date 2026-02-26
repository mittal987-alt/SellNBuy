"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

type Message = {
  _id: string;
  text: string;
  sender: string;
};

export default function ChatRoom() {
  const { id } = useParams();
  const chatId = String(id);

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId")
      : null;

  /* ================= LOAD MESSAGES ================= */

  const fetchMessages = async () => {
    const res = await api.get(`/chats/${chatId}`);
    setMessages(res.data);
  };

  useEffect(() => {
    if (!chatId) return;

    fetchMessages();

    // Auto refresh every 3 seconds
    const interval = setInterval(fetchMessages, 3000);

    return () => clearInterval(interval);
  }, [chatId]);

  /* ================= SEND ================= */

  const sendMessage = async () => {
    if (!text.trim()) return;

    const res = await api.post(`/chats/${chatId}`, { text });

    setMessages((prev) => [...prev, res.data]);
    setText("");
  };

  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col h-[80vh]">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`p-2 rounded w-fit max-w-[70%] ${
              m.sender === userId
                ? "ml-auto bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border rounded-lg px-3 py-2 flex-1"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
