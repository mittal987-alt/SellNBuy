"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { socket } from "@/lib/socket";
import { useUserStore } from "@/store/userStore";
import { FiSearch, FiMessageSquare, FiArrowRight, FiInbox, FiClock } from "react-icons/fi";

type Chat = {
  _id: string;
  buyer: { _id: string; name: string; avatar?: string };
  seller: { _id: string; name: string; avatar?: string };
  lastMessage: string;
  updatedAt: string;
};

export default function PremiumMessagesPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeTab, setActiveTab] = useState<"buying" | "selling">("buying");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUserStore();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    const loadChats = async () => {
      try {
        const res = await api.get("/chats");
        setChats(res.data);
      } catch (err) {
        console.error("Failed to load chats");
      }
    };

    loadChats();

    if (!socket.connected) socket.connect();
    socket.emit("register_user", userId);

    const handleNewNotification = (data: any) => {
      setChats((prev) => {
        const chatIndex = prev.findIndex((c) => c._id === data.chatId);
        if (chatIndex !== -1) {
          const updatedChat = { ...prev[chatIndex], lastMessage: data.text };
          const otherChats = prev.filter((_, i) => i !== chatIndex);
          return [updatedChat, ...otherChats];
        } else {
          loadChats();
          return prev;
        }
      });
    };

    socket.on("new_notification", handleNewNotification);
    return () => { socket.off("new_notification", handleNewNotification); };
  }, [userId]);

  const filteredChats = useMemo(() => {
    return chats
      .filter((chat) => (activeTab === "buying" ? chat.buyer?._id === userId : chat.seller?._id === userId))
      .filter((chat) => {
        const otherUser = chat.buyer?._id === userId ? chat.seller : chat.buyer;
        return otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      });
  }, [chats, activeTab, userId, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900">
              Inbox<span className="text-blue-600">.</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">Manage your conversations and offers</p>
          </div>

          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-full md:w-64 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* PREMIUM TABS */}
        <div className="inline-flex bg-white p-1.5 rounded-[2rem] shadow-sm border border-slate-200 mb-10">
          {(["buying", "selling"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-10 py-3 rounded-[1.8rem] text-sm font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? "text-white" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute inset-0 bg-slate-900 rounded-[1.8rem] -z-0" 
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>

        {/* CHAT LIST AREA */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <ChatCard key={chat._id} chat={chat} userId={userId!} />
              ))
            ) : (
              <EmptyMessages />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- REFINED SUB-COMPONENTS ---

function ChatCard({ chat, userId }: { chat: Chat; userId: string }) {
  const otherUser = chat.buyer?._id === userId ? chat.seller : chat.buyer;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className="group relative"
    >
      <Link href={`/chats/${chat._id}`}>
        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm group-hover:shadow-xl group-hover:shadow-blue-500/5 group-hover:border-blue-100 transition-all flex items-center gap-6">
          
          {/* Avatar with Status */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-slate-100 to-blue-50 flex items-center justify-center border-2 border-white shadow-inner overflow-hidden">
              {otherUser?.avatar ? (
                <img src={otherUser.avatar} alt={otherUser.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-black text-blue-600">{otherUser?.name?.[0]}</span>
              )}
            </div>
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-black text-slate-800 text-lg truncate tracking-tight">
                {otherUser?.name || "Premium User"}
              </h4>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <FiClock /> Just now
              </span>
            </div>
            <p className="text-slate-500 text-sm truncate pr-10 font-medium group-hover:text-slate-700 transition-colors">
              {chat.lastMessage || "Click to start the conversation..."}
            </p>
          </div>

          {/* Action Icon */}
          <div className="hidden md:flex w-12 h-12 rounded-full bg-slate-50 items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function EmptyMessages() {
  return (
    <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <FiInbox className="text-4xl text-slate-200" />
      </div>
      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Quiet in here...</h3>
      <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto font-medium leading-relaxed">
        Start a conversation by browsing listings or check back later for new inquiries.
      </p>
      <Link 
        href="/" 
        className="inline-block mt-8 bg-slate-900 text-white px-10 py-4 rounded-full font-bold shadow-lg hover:bg-blue-600 transition-all active:scale-95"
      >
        Browse Marketplace
      </Link>
    </div>
  );
}