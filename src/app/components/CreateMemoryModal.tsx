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
import { Plus, Upload } from "lucide-react";
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
      toast.success("Add Memory Success");
    },
    onError: (err) => {
      console.error(err);
      toast.error("ERROR");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleSaveMemory = async () => {
    if (!thoughts.trim()) return alert("Please write your thoughts");

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
        <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:cursor-pointer">
          <Plus size={16} /> New Memory
        </Button>
      </DialogTrigger>

      <DialogContent className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-purple-700">
            🌟 Create a New Memory
          </DialogTitle>
          <DialogDescription>
            Capture your thoughts, feelings, or anything special today ✨
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Title (optional)</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What happened today?"
            className="max-h-[85vh] max-w-[460px] overflow-x-auto"
          />
        </div>

        <div className="mt-3 space-y-2">
          <Label>Your thoughts*</Label>
          <Textarea
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            placeholder="Write about your day, feelings, or anything special..."
            className="max-h-[130px] max-w-[460px] overflow-auto"
          />
        </div>

        <div className="mt-4">
          <Label>Mood</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
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

        <div className="mt-4">
          <Label>Photos</Label>
          <div
            className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-pink-300 py-6 text-pink-500 transition hover:bg-pink-50"
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <Upload className="mb-1 h-6 w-6" />
            <span>Upload photos</span>
            <ul className="mt-2 max-h-32 overflow-auto text-left text-sm text-purple-700">
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

        <DialogFooter className="mt-6 flex justify-between">
          <Button
            variant="outline"
            className="border-purple-300 text-purple-600 hover:cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:cursor-pointer"
            onClick={handleSaveMemory}
            disabled={mutation.isPending || !thoughts}
          >
            {mutation.isPending ? "Saving..." : "Save Memory"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
