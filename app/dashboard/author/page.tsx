import Link from "next/link";
import { Role } from "@prisma/client";
import SubmissionCard from "@/components/SubmissionCard";
import { logoutAction } from "@/actions/auth";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AuthorDashboardPage() {
  const user = await requireUser([Role.AUTHOR]);

  const submissions = await prisma.submission.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Author Dashboard</h1>
          <p className="text-sm text-zinc-600">Welcome, {user.name}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/submissions/new" className="rounded bg-zinc-900 px-3 py-2 text-sm text-white">
            New submission
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="rounded border px-3 py-2 text-sm text-zinc-800">
              Logout
            </button>
          </form>
        </div>
      </div>

      <div className="space-y-3">
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
              createdAt={submission.createdAt}
            />
          ))
        )}
      </div>
    </main>
  );
}
