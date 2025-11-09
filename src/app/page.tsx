"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CreateMemoryModal } from "./components/CreateMemoryModal";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

const queryClient = new QueryClient();

export default function HomePageWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomePage />
    </QueryClientProvider>
  );
}

function HomePage() {
  const [search, setSearch] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 px-4 py-10 text-center">
      <header>
        <h1 className="text-2xl text-pink-400">📖 My Diary ✨</h1>
        <p className="mt-2 text-sm text-purple-700 sm:text-base">
          Capture your precious memories, thoughts, and moments in your personal digital diary ✨
        </p>
      </header>

      <div className="mt-8 flex min-w-[700px] items-center justify-between gap-4">
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your memories..."
          className="h-8 max-w-[420px] border-pink-300"
        />
        <CreateMemoryModal />
      </div>

      <section className="mt-24 flex flex-col items-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3373/3373034.png"
          alt="diary icon"
          className="mb-4 h-16 w-16"
        />
        <h2 className="text-xl font-semibold text-purple-700">Start your diary journey</h2>
        <p className="mt-1 mb-6 text-sm text-purple-600 sm:text-base">
          Create your first memory and begin documenting your beautiful journey
        </p>
        <button className="flex h-8 items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 font-medium text-white shadow-md transition hover:cursor-pointer hover:opacity-90">
          <Plus size={16} /> New Memory
        </button>
      </section>
    </main>
  );
}
