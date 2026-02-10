"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useMemoryById } from "@/apis/memories/queries";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowLeft, CalendarDays, Smile } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const queryClient = new QueryClient();

function MemoryDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: memory, isLoading, isError } = useMemoryById(id);

  if (isLoading) {
    return (
      <div className="mx-auto mt-16 max-w-md space-y-4 px-4 sm:max-w-2xl sm:p-6">
        <Skeleton className="h-10 w-2/5 rounded-md" />
        <Skeleton className="h-6 w-1/3 rounded-md" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          {Array(4)
            .fill(0)
            .map((_, idx) => (
              <Skeleton key={idx} className="h-40 w-full rounded-xl" />
            ))}
        </div>
      </div>
    );
  }

  if (isError || !memory) {
    return (
      <div className="mt-20 text-center text-red-500">
        Memory not found.
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <main className="mx-auto my-10 max-w-md rounded-2xl bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 px-4 py-6 shadow-md sm:max-w-3xl sm:p-8">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-pink-600 hover:bg-pink-50"
      >
        <ArrowLeft size={18} /> Back
      </Button>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2 text-2xl font-bold text-pink-700 sm:text-3xl"
      >
        {memory.title || "Untitled Memory"}
      </motion.h1>

      {/* Date */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
        <CalendarDays size={16} className="text-pink-400" />
        <p>{new Date(memory.createdAt).toLocaleString()}</p>
      </div>

      {/* Thoughts */}
      <p className="mb-6 text-sm leading-relaxed whitespace-pre-wrap text-gray-700 sm:text-base">
        {memory.thoughts}
      </p>

      {/* Photos */}
      {(memory.photos || []).length > 0 && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(memory.photos || []).map((url, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="relative aspect-square overflow-hidden rounded-xl shadow-sm"
            >
              <Image
                src={url}
                alt={`photo-${idx}`}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Mood */}
      {memory.mood && (
        <div className="flex items-center gap-2">
          <Smile className="text-pink-500" />
          <p className="text-lg">
            <span className="font-semibold text-purple-600">Mood:</span> {memory.mood}
          </p>
        </div>
      )}
    </main>
  );
}

export default function MemoryDetailsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-white sm:bg-gray-50">
        <MemoryDetailsContent />
      </div>
    </QueryClientProvider>
  );
}
