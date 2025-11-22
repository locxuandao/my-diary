"use client";

import { useState } from "react";
import { useMutation, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const queryClient = new QueryClient();

export default function LoginPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoginForm />
    </QueryClientProvider>
  );
}

function LoginForm() {
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: (password: string) => api.post("/api/auth", { password }).then((res) => res.data),
    onSuccess: (data) => {
      if (data.success) window.location.href = "/";
      toast.success("Login successful");
    },
    onError: () => {
      toast.error("ERROR");
      setPassword("");
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-pink-100 via-purple-100 to-blue-100">
      <div className="mb-10 flex flex-col items-center justify-center">
        <h1 className="text-2xl text-pink-400">📖 My Diary ✨</h1>
        <p className="mt-2 text-pink-400">
          Capture your precious memories, thoughts, and moments in your personal digital diary ✨
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(password);
        }}
        className="flex w-80 flex-col gap-4 rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur-md"
      >
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="26052003"
          className="min-h-[45px] rounded border border-pink-400 p-2 text-red-800 outline-none focus:ring-2 focus:ring-pink-400"
        />
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded bg-gradient-to-r from-pink-500 to-purple-500 p-2 font-medium text-white shadow-md hover:cursor-pointer hover:opacity-90"
        >
          {mutation.isPending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
