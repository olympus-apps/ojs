import Link from "next/link";
import { SubmissionStatus } from "@prisma/client";

type SubmissionCardProps = {
  id: string;
  title: string;
  abstract: string;
  status: SubmissionStatus;
  authorName?: string;
  createdAt: Date;
};

export default function SubmissionCard({
  id,
  title,
  abstract,
  status,
  authorName,
  createdAt,
}: SubmissionCardProps) {
  return (
    <article className="rounded border bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        <span className="rounded border px-2 py-1 text-xs font-medium text-zinc-700">{status}</span>
      </div>
      <p className="mt-2 line-clamp-3 text-sm text-zinc-700">{abstract}</p>
      <div className="mt-3 text-xs text-zinc-500">
        {authorName ? `Author: ${authorName} • ` : ""}
        {new Date(createdAt).toLocaleString()}
      </div>
      <Link href={`/submissions/${id}`} className="mt-3 inline-block text-sm font-medium text-zinc-900 underline">
        View submission
      </Link>
    </article>
  );
}
