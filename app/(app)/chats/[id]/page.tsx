"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiSend, FiArrowLeft } from "react-icons/fi";
import api from "@/lib/api";
import { socket } from "@/lib/socket";
import { useUserStore } from "@/store/userStore";

type Message = {
  _id: string;
  text: string;
  sender: string;
  createdAt?: string;
};

type ChatMeta = {
  _id: string;
  buyer: any;
  seller: any;
  adId: any;
};

export default function ChatRoom() {
  const { id } = useParams();
  const router = useRouter();
  const chatId = String(id);

  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [chatMeta, setChatMeta] = useState<ChatMeta | null>(null);
  const [text, setText] = useState("");
  const { user } = useUserStore();
  const userId = user?.id;
  const [loading, setLoading] = useState(true);


  // ✅ LOAD CHAT
  useEffect(() => {
    if (!chatId || !userId) return;

    const load = async () => {
      try {
        const res = await api.get(`/chats/${chatId}`);

        console.log("CHAT RESPONSE:", res.data);

        setMessages(res.data.messages || []);
        setChatMeta(res.data.chat);
      } catch (err: any) {
        console.error("LOAD ERROR:", err.response?.data || err);
        alert("Failed to load chat");
      } finally {
        setLoading(false);
      }
    };

    load();

    // socket setup
    if (!socket.connected) socket.connect();

    socket.emit("join_chat", chatId);

    const handleMessage = (msg: Message) => {
      setMessages((prev) => {
        const exists = prev.find((m) => m._id === msg._id);
        if (exists) return prev;
        return [...prev, msg];
      });
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, [chatId, userId]);

  // ✅ AUTO SCROLL
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ SEND MESSAGE
  const sendMessage = async () => {
    if (!text.trim() || !userId) return;

    const tempId = `temp-${Date.now()}`;
    const messageText = text.trim();

    setText("");

    const tempMsg: Message = {
      _id: tempId,
      text: messageText,
      sender: userId,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await api.post(`/chats/${chatId}`, {
        text: messageText,
      });

      const saved = res.data;

      setMessages((prev) =>
        prev.map((m) => (m._id === tempId ? saved : m))
      );

      socket.emit("send_message", saved);

    } catch (err) {
      console.error("SEND ERROR:", err);
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
      alert("Message failed");
    }
  };

  const formatTime = (iso?: string) => {
    if (!iso) return "";
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading chat...
      </div>
    );
  }

  // ❌ ERROR STATE
  if (!chatMeta) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Chat not found
      </div>
    );
  }

  const otherUser =
    chatMeta.buyer._id === userId
      ? chatMeta.seller
      : chatMeta.buyer;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB]">

      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 bg-white border-b px-4 py-3 z-30 flex items-center gap-4">
        <button onClick={() => router.back()}>
          <FiArrowLeft />
        </button>

        <h2 className="font-bold">
          {otherUser?.name || "User"}
        </h2>
      </header>

      {/* MESSAGES */}
      <main className="flex-1 pt-20 pb-24 px-4 overflow-y-auto">
        <div className="space-y-3">
          {messages.map((m) => {
            const isMe = m.sender === userId;

            return (
              <div
                key={m._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-[70%] ${
                    isMe
                      ? "bg-blue-600 text-white"
                      : "bg-white border"
                  }`}
                >
                  <p>{m.text}</p>
                  <span className="text-xs opacity-70">
                    {formatTime(m.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </main>

      {/* INPUT */}
      <div className="fixed bottom-0 inset-x-0 bg-white p-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          disabled={!text.trim()}
          className="bg-blue-600 text-white px-4 rounded disabled:bg-gray-300"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
}