"use client";

import { useState } from "react";

export default function ChatsPage() {
  const [activeChat, setActiveChat] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      <h1 className="text-2xl font-bold mb-6">Chats</h1>

      <div className="grid grid-cols-12 gap-6 h-[70vh]">

        {/* ================= CHAT LIST ================= */}
        <aside
          className={`
            col-span-12 md:col-span-4 lg:col-span-3
            border rounded-xl bg-white dark:bg-neutral-900
            overflow-y-auto
            ${activeChat !== null ? "hidden md:block" : ""}
          `}
        >
          <ChatItem
            name="Rahul"
            lastMessage="Is this still available?"
            onClick={() => setActiveChat(1)}
          />
          <ChatItem
            name="Aman"
            lastMessage="Can you lower the price?"
            onClick={() => setActiveChat(2)}
          />
        </aside>

        {/* ================= CHAT WINDOW ================= */}
        <main
          className={`
            col-span-12 md:col-span-8 lg:col-span-9
            border rounded-xl bg-white dark:bg-neutral-900
            flex flex-col
            ${activeChat === null ? "hidden md:flex" : ""}
          `}
        >
          {activeChat ? (
            <>
              {/* Header */}
              <div className="border-b px-4 py-3 font-medium flex items-center gap-3">
                <button
                  onClick={() => setActiveChat(null)}
                  className="md:hidden text-gray-500"
                >
                  ←
                </button>
                Chat with Seller
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                <Message text="Hello!" />
                <Message text="Is this item available?" />
                <Message text="Yes, it is 👍" mine />
              </div>

              {/* Input */}
              <div className="border-t p-3 flex gap-2">
                <input
                  placeholder="Type a message…"
                  className="flex-1 border rounded-lg px-3 py-2"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg">
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation 💬
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function ChatItem({
  name,
  lastMessage,
  onClick,
}: {
  name: string;
  lastMessage: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        w-full text-left px-4 py-3 border-b
        hover:bg-gray-50 dark:hover:bg-neutral-800
        transition
      "
    >
      <p className="font-medium">{name}</p>
      <p className="text-sm text-gray-500 truncate">
        {lastMessage}
      </p>
    </button>
  );
}

function Message({
  text,
  mine,
}: {
  text: string;
  mine?: boolean;
}) {
  return (
    <div
      className={`
        max-w-[70%] px-4 py-2 rounded-xl text-sm
        ${mine
          ? "ml-auto bg-blue-600 text-white"
          : "bg-gray-100 dark:bg-neutral-800"}
      `}
    >
      {text}
    </div>
  );
}
