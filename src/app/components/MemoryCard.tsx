"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Trash2, Heart } from "lucide-react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  title?: string;
  thoughts: string;
  mood: string;
  photos: string[];
  createAt: Date;
  onDelete?: () => void;
  id: string;
}

export const MemoryCard = (props: Props) => {
  const { createAt, mood, photos, thoughts, title, onDelete, id } = props;
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Card
      className={cn(
        "relative w-full max-w-md rounded-2xl border border-pink-200 bg-gradient-to-b from-pink-50 to-white p-4 shadow-sm transition hover:shadow-md sm:max-w-xl sm:p-5"
      )}
    >
      {/* Header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium text-pink-600">
          <Heart className="h-4 w-4 fill-pink-600" />
          <p className="text-xs sm:text-sm">
            {format(new Date(createAt), "EEEE, MMMM dd, yyyy", { locale: enUS })}
          </p>
        </div>

        {onDelete && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:cursor-pointer hover:text-pink-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-[350px] rounded-xl p-5 sm:p-6">
              <DialogHeader>
                <DialogTitle className="text-base text-purple-700 sm:text-lg">
                  Confirm Delete
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                  Are you sure you want to delete this memory? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    onDelete?.();
                    setOpen(false);
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90"
                >
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Content */}
      <div className="mb-4 flex flex-col items-start space-y-1">
        {title && (
          <p className="max-w-full text-sm font-semibold break-words text-purple-700">{title}</p>
        )}
        <p
          onClick={() => router.push(`/memories/${id}`)}
          className="line-clamp-3 max-w-full text-sm break-words text-gray-700 hover:cursor-pointer hover:underline"
        >
          {thoughts}
        </p>
      </div>

      {/* Photos */}
      {photos && photos.length > 0 && (
        <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((url, idx) => (
            <div
              key={idx}
              className="relative aspect-square overflow-hidden rounded-xl border border-pink-100 shadow-sm"
            >
              <Image
                src={url}
                alt={`memory-photo-${idx}`}
                fill
                className="object-cover transition hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-start">
        <span className="text-2xl sm:text-3xl">{mood}</span>
      </div>
    </Card>
  );
};
