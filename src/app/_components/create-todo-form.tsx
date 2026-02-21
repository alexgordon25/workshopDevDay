"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export function CreateTodoForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const utils = api.useUtils();
  const create = api.todo.create.useMutation({
    onSuccess: async () => {
      await utils.todo.getAll.invalidate();
      setTitle("");
      setDescription("");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    create.mutate({ title: title.trim(), description: description.trim() || undefined });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 flex flex-col gap-3 rounded-xl bg-white/10 p-4"
    >
      <input
        type="text"
        placeholder="Todo title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="rounded-lg bg-white/10 px-4 py-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-400"
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="resize-none rounded-lg bg-white/10 px-4 py-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-400"
      />
      <button
        type="submit"
        disabled={create.isPending || !title.trim()}
        className="self-end rounded-full bg-purple-600 px-6 py-2 font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
      >
        {create.isPending ? "Adding..." : "Add Todo"}
      </button>
    </form>
  );
}
