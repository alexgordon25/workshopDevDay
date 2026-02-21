"use client";

import { api } from "~/trpc/react";
import { TodoItem } from "./todo-item";

export function TodoList() {
  const [todos] = api.todo.getAll.useSuspenseQuery();

  if (todos.length === 0) {
    return (
      <p className="py-8 text-center text-white/50">
        No todos yet. Add one above!
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
