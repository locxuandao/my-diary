"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Plus, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const moods = ["😊", "😢", "😍", "🥳", "😔", "😂", "🙂", "🤩"];

export function CreateMemoryModal() {
  const [open, setOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [thoughts, setThoughts] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: {
      title: string;
      thoughts: string;
      mood: string | null;
      photos: string[];
    }) => axios.post("/api/memories", data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
      setTitle("");
      setThoughts("");
      setSelectedMood(null);
      setPhotos([]);
      setOpen(false);
      toast.success("Memory added successfully ✨");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Something went wrong ❌");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setPhotos(Array.from(e.target.files));
  };

  const handleSaveMemory = async () => {
    if (!thoughts.trim()) return toast.warning("Please write your thoughts 📝");

    const photoUrls: string[] = [];

    for (const file of photos) {
      const fileName = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from("memories").upload(fileName, file);
      if (error) {
        console.error("Upload failed:", error.message);
        continue;
      }
      const { data: urlData } = supabase.storage.from("memories").getPublicUrl(fileName);
      photoUrls.push(urlData.publicUrl);
    }

    mutation.mutate({ title, thoughts, mood: selectedMood, photos: photoUrls });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 rounded-md bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:opacity-90 sm:text-base">
          <Plus size={16} /> New Memory
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] w-[90vw] max-w-md overflow-y-auto rounded-2xl bg-white/90 p-4 backdrop-blur-md sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-purple-700 sm:text-xl">
            🌟 Create a New Memory
          </DialogTitle>
          <DialogDescription className="text-sm text-purple-600">
            Capture your thoughts, feelings, or anything special today ✨
          </DialogDescription>
        </DialogHeader>

        {/* Title */}
        <div className="mt-3 space-y-2">
          <Label className="text-sm text-purple-700">Title (optional)</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What happened today?"
            className="w-full rounded-md border-pink-300 text-sm focus:ring-2 focus:ring-pink-300"
          />
        </div>

        {/* Thoughts */}
        <div className="mt-4 space-y-2">
          <Label className="text-sm text-purple-700">Your thoughts*</Label>
          <Textarea
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            placeholder="Write about your day..."
            className="max-h-[150px] w-full resize-none rounded-md border-pink-300 text-sm focus:ring-2 focus:ring-pink-300"
          />
        </div>

        {/* Mood */}
        <div className="mt-4">
          <Label className="text-sm text-purple-700">Mood</Label>
          <div className="mt-2 flex flex-wrap justify-start gap-2">
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                type="button"
                className={cn(
                  "rounded-md border p-2 text-2xl transition-all",
                  selectedMood === mood
                    ? "scale-110 border-pink-400 bg-pink-100"
                    : "border-transparent hover:bg-pink-50"
                )}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div className="mt-5">
          <Label className="text-sm text-purple-700">Photos</Label>
          <div
            className="mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-pink-300 py-6 text-center text-pink-500 transition hover:bg-pink-50"
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <Upload className="mb-1 h-6 w-6" />
            <span className="text-sm">Tap to upload</span>
            <ul className="mt-2 max-h-24 w-full overflow-auto px-2 text-left text-xs text-purple-700">
              {photos.map((file) => (
                <li key={file.name} className="truncate">
                  {file.name}
                </li>
              ))}
            </ul>
            <input
              id="file-input"
              type="file"
              className="hidden"
              accept=".png, .jpg, .jpeg"
              multiple
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            className="border-purple-300 text-purple-600 transition hover:bg-purple-50"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveMemory}
            disabled={mutation.isPending || !thoughts}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Memory"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
