"use client";

import { useState } from "react";
import { useMutation, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

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
      if (data.success) {
        toast.success("Login successful 🎉");
        setTimeout(() => {
          window.location.href = "/";
        }, 800);
      } else {
        toast.error("Invalid password");
        setPassword("");
      }
    },
    onError: () => {
      toast.error("Login failed ❌");
      setPassword("");
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 px-4 py-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl font-bold text-pink-500 sm:text-4xl">📖 My Diary ✨</h1>
        <p className="mt-2 text-sm text-purple-700 sm:text-base">
          Capture your precious memories, thoughts, and moments in your personal digital diary
        </p>
      </motion.header>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(password);
        }}
        className="flex w-full max-w-xs flex-col gap-4 rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur-md sm:max-w-sm"
      >
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="h-11 rounded-md border border-pink-300 text-center text-purple-900 placeholder:text-pink-400 focus:ring-2 focus:ring-pink-400"
        />

        <button
          type="submit"
          disabled={mutation.isPending || !password}
          className="flex h-11 items-center justify-center rounded-md bg-gradient-to-r from-pink-500 to-purple-500 font-medium text-white shadow-md transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="mt-2 text-center text-xs text-purple-600">
          🔒 Your diary is safe and private
        </p>
      </motion.form>
    </main>
  );
}
