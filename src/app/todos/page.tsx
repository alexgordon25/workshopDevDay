import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { CreateTodoForm } from "~/app/_components/create-todo-form";
import { TodoList } from "~/app/_components/todo-list";
import { auth } from "~/server/better-auth";
import { getSession } from "~/server/better-auth/server";
import { api, HydrateClient } from "~/trpc/server";

export default async function TodosPage() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  void api.todo.getAll.prefetch();

  return (
    <HydrateClient>
      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container mx-auto max-w-2xl px-4 py-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Todos</h1>
              <p className="mt-1 text-sm text-white/60">
                Welcome, {session.user.name}
              </p>
            </div>
            <form>
              <button
                formAction={async () => {
                  "use server";
                  await auth.api.signOut({ headers: await headers() });
                  redirect("/sign-in");
                }}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
              >
                Sign out
              </button>
            </form>
          </div>
          <CreateTodoForm />
          <TodoList />
        </div>
      </main>
    </HydrateClient>
  );
}
