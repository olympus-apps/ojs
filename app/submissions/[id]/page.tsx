import Link from "next/link";
import { Role, SubmissionStatus } from "@prisma/client";
import { assignSubmissionAction } from "@/actions/submission";
import { submitReviewAction } from "@/actions/review";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSubmissionReviewer } from "@/lib/reviewer-assignment";

type SubmissionDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function SubmissionDetailPage({ params, searchParams }: SubmissionDetailPageProps) {
  const { id } = await params;
  const { error } = await searchParams;
  const user = await getSessionUser();

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      author: {
        select: { name: true, email: true },
      },
      reviews: {
        include: {
          reviewer: {
            select: { name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!submission) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <p className="rounded border bg-white p-4 text-sm text-zinc-700">Submission not found.</p>
      </main>
    );
  }

  const reviewers = await prisma.user.findMany({
    where: { role: Role.REVIEWER },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  const assignedReviewerId = await getSubmissionReviewer(submission.id);
  const assignedReviewer = reviewers.find((reviewer) => reviewer.id === assignedReviewerId) ?? null;

  const alreadyReviewed =
    user?.role === Role.REVIEWER
      ? submission.reviews.some((review) => review.reviewerId === user.id)
      : false;

  return (
    <main className="mx-auto w-full max-w-3xl space-y-4 px-4 py-8">
      {error ? <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <article className="rounded border bg-white p-5">
        <h1 className="text-2xl font-semibold text-zinc-900">{submission.title}</h1>
        <div className="mt-1 text-sm text-zinc-600">Author: {submission.author.name} ({submission.author.email})</div>
        <div className="mt-1 text-sm text-zinc-600">Status: {submission.status}</div>
        <div className="mt-1 text-sm text-zinc-600">
          Assigned reviewer: {assignedReviewer ? `${assignedReviewer.name} (${assignedReviewer.email})` : "Not assigned"}
        </div>

        <p className="mt-4 whitespace-pre-wrap text-sm text-zinc-800">{submission.abstract}</p>

        <a href={submission.fileUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-medium text-zinc-900 underline">
          Open uploaded file
        </a>
      </article>

      {user?.role === Role.ADMIN && submission.status === SubmissionStatus.SUBMITTED ? (
        <form action={assignSubmissionAction} className="rounded border bg-white p-4">
          <input type="hidden" name="submissionId" value={submission.id} />
          <h2 className="text-lg font-semibold text-zinc-900">Editor Action</h2>
          <p className="mt-1 text-sm text-zinc-600">Assign this submission to a specific reviewer and move it to UNDER_REVIEW.</p>
          <label className="mt-3 block">
            <span className="mb-1 block text-sm font-medium text-zinc-800">Reviewer</span>
            <select name="reviewerId" required className="w-full rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-800 focus:ring-2">
              <option value="">Select reviewer</option>
              {reviewers.map((reviewer) => (
                <option key={reviewer.id} value={reviewer.id}>
                  {reviewer.name} ({reviewer.email})
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="mt-3 rounded bg-zinc-900 px-3 py-2 text-sm text-white">
            Assign for review
          </button>
        </form>
      ) : null}

      {user?.role === Role.REVIEWER && submission.status === SubmissionStatus.UNDER_REVIEW && !alreadyReviewed ? (
        <form action={submitReviewAction} className="rounded border bg-white p-4">
          <input type="hidden" name="submissionId" value={submission.id} />
          <h2 className="text-lg font-semibold text-zinc-900">Submit Review</h2>

          <label className="mt-3 block">
            <span className="mb-1 block text-sm font-medium text-zinc-800">Decision</span>
            <select name="decision" required className="w-full rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-800 focus:ring-2">
              <option value="ACCEPT">ACCEPT</option>
              <option value="REJECT">REJECT</option>
            </select>
          </label>

          <label className="mt-3 block">
            <span className="mb-1 block text-sm font-medium text-zinc-800">Comment</span>
            <textarea
              name="comment"
              required
              rows={5}
              className="w-full rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-800 focus:ring-2"
            />
          </label>

          <button type="submit" className="mt-3 rounded bg-zinc-900 px-3 py-2 text-sm text-white">
            Save review
          </button>
        </form>
      ) : null}

      <section className="rounded border bg-white p-4">
        <h2 className="text-lg font-semibold text-zinc-900">Reviews</h2>
        {submission.reviews.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-600">No reviews yet.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {submission.reviews.map((review) => (
              <li key={review.id} className="rounded border p-3">
                <div className="text-sm font-medium text-zinc-800">
                  {review.reviewer.name} ({review.reviewer.email}) - {review.decision}
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-700">{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="text-sm text-zinc-700">
        <Link href="/" className="underline">
          Back to home
        </Link>
      </div>
    </main>
  );
}
