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
        "relative w-full max-w-xl rounded-2xl border border-pink-200 bg-pink-50 p-5 shadow-sm"
      )}
    >
      <div className="mb-3 flex justify-between">
        <div className="flex items-center gap-2 font-medium text-pink-600">
          <Heart className="h-4 w-4 fill-pink-600" />
          <p>
            {format(new Date(createAt), "EEEE, MMMM dd, yyyy", {
              locale: enUS,
            })}
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
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogDescription>Are you sure you want to clear memory?</DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="border-gray-300"
                >
                  Cancle
                </Button>
                <Button
                  onClick={() => {
                    onDelete?.();
                    setOpen(false);
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                >
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="mb-4 flex flex-col items-start space-y-1">
        <p className="max-w-full text-sm font-semibold wrap-break-word whitespace-pre-wrap text-purple-700">
          {title}
        </p>
        <p
          onClick={() => router.push(`/memories/${id}`)}
          className="line-clamp-3 max-w-full wrap-break-word whitespace-pre-wrap text-gray-700 hover:cursor-pointer hover:underline"
        >
          {thoughts}
        </p>
      </div>

      {photos && photos.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-3">
          {photos.map((url, idx) => (
            <div key={idx} className="relative overflow-hidden rounded-xl shadow-md">
              <Image
                src={url}
                alt={`memory-photo-${idx}`}
                width={400}
                height={200}
                className="rounded-xl object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-start">
        <span className="text-2xl">{mood}</span>
      </div>
    </Card>
  );
};
