"use client";

import { api } from "~/trpc/react";

type TodoStatus = "PENDING" | "IN_PROGRESS" | "DONE";

interface Todo {
  id: number;
  title: string;
  description: string | null;
  status: TodoStatus;
}

const STATUS_LABELS: Record<TodoStatus, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const STATUS_COLORS: Record<TodoStatus, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-300",
  IN_PROGRESS: "bg-blue-500/20 text-blue-300",
  DONE: "bg-green-500/20 text-green-300",
};

export function TodoItem({ todo }: { todo: Todo }) {
  const utils = api.useUtils();

  const updateStatus = api.todo.updateStatus.useMutation({
    onSuccess: () => utils.todo.getAll.invalidate(),
  });

  const deleteTodo = api.todo.delete.useMutation({
    onSuccess: () => utils.todo.getAll.invalidate(),
  });

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white/10 p-4 transition hover:bg-white/[0.12]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className={`font-semibold ${todo.status === "DONE" ? "line-through opacity-60" : ""}`}>
            {todo.title}
          </p>
          {todo.description && (
            <p className="mt-1 text-sm text-white/60">{todo.description}</p>
          )}
        </div>
        <button
          onClick={() => deleteTodo.mutate({ id: todo.id })}
          disabled={deleteTodo.isPending}
          className="shrink-0 rounded-lg px-2 py-1 text-xs text-white/40 transition hover:bg-red-500/20 hover:text-red-400 disabled:opacity-30"
        >
          Delete
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[todo.status]}`}>
          {STATUS_LABELS[todo.status]}
        </span>
        <select
          value={todo.status}
          onChange={(e) =>
            updateStatus.mutate({ id: todo.id, status: e.target.value as TodoStatus })
          }
          disabled={updateStatus.isPending}
          className="ml-auto rounded-lg bg-white/10 px-2 py-1 text-xs text-white outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50"
        >
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>
    </div>
  );
}
