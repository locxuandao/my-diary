"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useMemoryById } from "@/apis/memories/queries";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const queryClient = new QueryClient();

function MemoryDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: memory, isLoading, isError } = useMemoryById(id);

  if (isLoading) {
    return (
      <div className="mx-auto mt-16 max-w-3xl space-y-4 p-6">
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
    <main className="mx-auto mt-10 max-w-3xl rounded-xl bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 p-6 shadow-lg">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-pink-600 hover:bg-pink-50"
      >
        <ArrowLeft size={18} /> Back
      </Button>

      {/* Title */}
      <h1 className="mb-2 text-3xl font-bold text-pink-700">{memory.title || "Untitled Memory"}</h1>

      {/* Created at */}
      <p className="mb-6 text-sm text-gray-500">{new Date(memory.createdAt).toLocaleString()}</p>

      {/* Thoughts */}
      <p className="mb-6 text-base leading-relaxed wrap-break-word whitespace-pre-wrap text-gray-700">
        {memory.thoughts}
      </p>

      {/* Photos */}
      {(memory.photos || []).length > 0 && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(memory.photos || []).map((url, idx) => (
            <div key={idx} className="relative aspect-square overflow-hidden rounded-xl shadow-sm">
              <Image
                src={url}
                alt={`photo-${idx}`}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}

      {/* Mood */}
      {memory.mood && (
        <p className="text-lg">
          <span className="font-semibold text-purple-600">Mood:</span> {memory.mood}
        </p>
      )}
    </main>
  );
}

export default function MemoryDetailsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 py-10">
        <MemoryDetailsContent />
      </div>
    </QueryClientProvider>
  );
}
