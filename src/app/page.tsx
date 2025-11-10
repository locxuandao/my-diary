"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CreateMemoryModal } from "./components/CreateMemoryModal";
import { Input } from "@/components/ui/input";
import { NotebookPen } from "lucide-react";
import { useMemories } from "@/apis/memories/queries";
import { Pagination } from "./components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [page, setPage] = useState(1);

  const { data: memories, isLoading } = useMemories({ page });
  console.log(memories);

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

      {isLoading ? (
        Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="mb-4 rounded border p-4">
            <Skeleton className="mb-2 h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))
      ) : (memories?.data?.length ?? 0) > 0 ? (
        <>
          {memories?.data.map((memory) => (
            <div key={memory.id} className="mb-4 rounded border p-2">
              <h3>{memory.title || "No title"}</h3>
              <p>{memory.thoughts}</p>
            </div>
          ))}

          {memories?.pagination && (
            <Pagination
              page={memories.pagination.currentPage}
              totalPages={memories.pagination.totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </>
      ) : (
        <section className="mt-24 flex flex-col items-center">
          <NotebookPen height={80} width={80} className="text-pink-800" />
          <h2 className="text-xl font-semibold text-purple-700">Start your diary journey</h2>
          <p className="mt-1 mb-6 text-sm text-purple-600 sm:text-base">
            Create your first memory and begin documenting your beautiful journey
          </p>
          <CreateMemoryModal />
        </section>
      )}
    </main>
  );
}
