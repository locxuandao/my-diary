"use client";

import { useState } from "react";
import { useMutation, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import api from "@/lib/axios";

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
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate(password);
      }}
      className="mx-auto mt-40 flex w-80 flex-col gap-4"
    >
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Nhập mật khẩu"
        className="rounded border p-2"
      />
      <button
        type="submit"
        disabled={mutation.isPending}
        className="rounded bg-blue-500 p-2 text-white"
      >
        {mutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}
