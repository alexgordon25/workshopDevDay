import Link from "next/link";
import { redirect } from "next/navigation";

import { getSession } from "~/server/better-auth/server";

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect("/todos");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex flex-col items-center gap-8 px-4 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Todo <span className="text-[hsl(280,100%,70%)]">App</span>
        </h1>
        <p className="max-w-md text-lg text-white/70">
          Stay organized. Track your tasks with PENDING, IN PROGRESS, and DONE
          statuses.
        </p>
        <div className="flex gap-4">
          <Link
            href="/sign-in"
            className="rounded-full bg-purple-600 px-8 py-3 font-semibold transition hover:bg-purple-700"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-white/10 px-8 py-3 font-semibold transition hover:bg-white/20"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
