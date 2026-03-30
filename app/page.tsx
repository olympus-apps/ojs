import Link from "next/link";
import { Role } from "@prisma/client";
import SubmissionCard from "@/components/SubmissionCard";
import { logoutAction } from "@/actions/auth";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const user = await getSessionUser();
  const submissions = await prisma.submission.findMany({
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const dashboardPath =
    user?.role === Role.AUTHOR
      ? "/dashboard/author"
      : user?.role === Role.REVIEWER
        ? "/dashboard/reviewer"
        : "/";

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900">Open Journal System</h1>
          <p className="text-sm text-zinc-600">Phase 1 MVP - Public submissions list</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {!user ? (
            <>
              <Link href="/login" className="rounded border px-3 py-2 text-zinc-800">
                Login
              </Link>
              <Link href="/register" className="rounded bg-zinc-900 px-3 py-2 text-white">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link href={dashboardPath} className="rounded border px-3 py-2 text-zinc-800">
                Dashboard
              </Link>
              {user.role === Role.AUTHOR ? (
                <Link href="/submissions/new" className="rounded bg-zinc-900 px-3 py-2 text-white">
                  Submit paper
                </Link>
              ) : null}
              <form action={logoutAction}>
                <button type="submit" className="rounded border px-3 py-2 text-zinc-800">
                  Logout
                </button>
              </form>
            </>
          )}
        </div>
      </header>

      <section className="space-y-3">
        {submissions.length === 0 ? (
          <p className="rounded border bg-white p-4 text-sm text-zinc-600">No submissions yet.</p>
        ) : (
          submissions.map((submission) => (
            <SubmissionCard
              key={submission.id}
              id={submission.id}
              title={submission.title}
              abstract={submission.abstract}
              status={submission.status}
              authorName={submission.author.name}
              createdAt={submission.createdAt}
            />
          ))
        )}
      </section>
    </main>
  );
}
