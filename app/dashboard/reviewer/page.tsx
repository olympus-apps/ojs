import Link from "next/link";
import { Role, SubmissionStatus } from "@prisma/client";
import SubmissionCard from "@/components/SubmissionCard";
import { logoutAction } from "@/actions/auth";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSubmissionReviewer } from "@/lib/reviewer-assignment";

type ReviewerDashboardProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function ReviewerDashboardPage({ searchParams }: ReviewerDashboardProps) {
  const { error } = await searchParams;
  const reviewer = await requireUser([Role.REVIEWER]);

  const underReviewSubmissions = await prisma.submission.findMany({
    where: { status: SubmissionStatus.UNDER_REVIEW },
    include: {
      author: {
        select: { name: true },
      },
      reviews: {
        where: { reviewerId: reviewer.id },
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const assignmentChecks = await Promise.all(
    underReviewSubmissions.map(async (submission) => ({
      submission,
      assignedReviewerId: await getSubmissionReviewer(submission.id),
    })),
  );

  const pending = assignmentChecks
    .filter((entry) => entry.assignedReviewerId === reviewer.id)
    .map((entry) => entry.submission)
    .filter((submission) => submission.reviews.length === 0);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Reviewer Dashboard</h1>
          <p className="text-sm text-zinc-600">Welcome, {reviewer.name}</p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="rounded border px-3 py-2 text-sm text-zinc-800">
            Logout
          </button>
        </form>
      </div>

      {error ? <p className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <p className="mb-4 text-sm text-zinc-600">
        You only see submissions assigned to you by the editor.
      </p>

      <div className="space-y-3">
        {pending.length === 0 ? (
          <p className="rounded border bg-white p-4 text-sm text-zinc-600">No assigned submissions pending review.</p>
        ) : (
          pending.map((submission) => (
            <div key={submission.id}>
              <SubmissionCard
                id={submission.id}
                title={submission.title}
                abstract={submission.abstract}
                status={submission.status}
                authorName={submission.author.name}
                createdAt={submission.createdAt}
              />
              <Link href={`/submissions/${submission.id}`} className="mt-1 inline-block text-sm text-zinc-900 underline">
                Open and submit review
              </Link>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
