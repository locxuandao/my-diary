"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CreateMemoryModal } from "./components/CreateMemoryModal";
import { Input } from "@/components/ui/input";
import { NotebookPen } from "lucide-react";
import { useDeleteMemory, useMemories } from "@/apis/memories/queries";
import { Pagination } from "./components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { MemoryCard } from "./components/MemoryCard";
import { useDebounce } from "@/hooks/useDebounce";

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
  const debouncedSearch = useDebounce(search, 500);

  const { data: memories, isLoading } = useMemories({
    page,
    query: debouncedSearch,
  });

  const deleteMutation = useDeleteMemory();

  const handleDeleteMemory = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 px-4 py-8 text-center">
      <header className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-pink-400 sm:text-3xl">📖 My Diary ✨</h1>
        <p className="mt-2 text-sm text-purple-700 sm:text-base">
          Capture your precious memories, thoughts, and moments in your personal digital diary ✨
        </p>
      </header>

      {/* 🔍 Search + Create */}
      <div className="mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search your memories..."
          className="h-10 w-full border-pink-300 text-sm sm:text-base"
        />
        <div className="flex justify-center sm:justify-end">
          <CreateMemoryModal />
        </div>
      </div>

      {/* 📝 List memories */}
      <section className="mt-6 w-full max-w-md">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="mb-4 rounded border bg-white/60 p-4 shadow-sm">
              <Skeleton className="mb-2 h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))
        ) : (memories?.data?.length ?? 0) > 0 ? (
          <>
            <div className="flex flex-col gap-4">
              {memories?.data.map((memory) => (
                <MemoryCard
                  key={memory.id}
                  id={memory.id}
                  title={memory.title || ""}
                  thoughts={memory.thoughts}
                  mood={memory.mood || "🙂"}
                  photos={memory.photos || []}
                  createAt={new Date(memory.createdAt)}
                  onDelete={() => handleDeleteMemory(memory.id)}
                />
              ))}
            </div>

            {memories?.pagination && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  page={memories.pagination.currentPage}
                  totalPages={memories.pagination.totalPages}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </div>
            )}
          </>
        ) : (
          <section className="mt-24 flex flex-col items-center text-center">
            <NotebookPen height={80} width={80} className="text-pink-800" />
            <h2 className="mt-4 text-lg font-semibold text-purple-700 sm:text-xl">
              Start your diary journey
            </h2>
            <p className="mt-1 mb-6 text-sm text-purple-600 sm:text-base">
              Create your first memory and begin documenting your beautiful journey
            </p>
            <CreateMemoryModal />
          </section>
        )}
      </section>
    </main>
  );
}
