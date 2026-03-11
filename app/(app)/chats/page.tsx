"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { socket } from "@/lib/socket"; // Import your socket utility

type Message = {
  _id: string;
  text: string;
  sender: string;
};

export default function ChatRoom() {
  const { id } = useParams();
  const chatId = String(id);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // --- 1. INITIAL LOAD & SOCKET SETUP ---
  useEffect(() => {
    if (!chatId) return;

    // Load history
    const fetchMessages = async () => {
      const res = await api.get(`/chats/${chatId}`);
      setMessages(res.data);
    };
    fetchMessages();

    // Socket Connection
    socket.connect();
    socket.emit("join_chat", chatId);

    // Listen for new messages
    socket.on("receive_message", (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [chatId]);

  // --- 2. AUTO SCROLL TO BOTTOM ---
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- 3. SEND MESSAGE ---
  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      // Step A: Save to MongoDB via API
      const res = await api.post(`/chats/${chatId}`, { text });
      const savedMsg = res.data;

      // Step B: Update local state
      setMessages((prev) => [...prev, savedMsg]);

      // Step C: Emit to socket for the other user
      socket.emit("send_message", { 
        chatId, 
        text: savedMsg.text, 
        sender: userId, 
        _id: savedMsg._id 
      });

      setText("");
    } catch (err) {
      alert("Failed to send message");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col h-[85vh]">
      <div className="flex-1 overflow-y-auto space-y-3 px-2">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`p-3 rounded-2xl w-fit max-w-[80%] shadow-sm ${
              m.sender === userId
                ? "ml-auto bg-blue-600 text-white rounded-tr-none"
                : "bg-gray-200 text-gray-800 rounded-tl-none"
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="flex gap-2 mt-4 bg-white p-2 border-t">
        <input
          value={text}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          onChange={(e) => setText(e.target.value)}
          className="border rounded-full px-5 py-3 flex-1 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-6 rounded-full font-bold hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}