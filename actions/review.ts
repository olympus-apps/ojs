"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ReviewDecision, Role, SubmissionStatus } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  clearSubmissionReviewer,
  getSubmissionReviewer,
} from "@/lib/reviewer-assignment";

function parseDecision(value: FormDataEntryValue | null): ReviewDecision | null {
  if (value === ReviewDecision.ACCEPT) {
    return ReviewDecision.ACCEPT;
  }
  if (value === ReviewDecision.REJECT) {
    return ReviewDecision.REJECT;
  }
  return null;
}

export async function submitReviewAction(formData: FormData): Promise<void> {
  const reviewer = await requireUser([Role.REVIEWER]);
  const submissionId = String(formData.get("submissionId") || "");
  const decision = parseDecision(formData.get("decision"));
  const comment = String(formData.get("comment") || "").trim();

  if (!submissionId || !decision || !comment) {
    redirect(`/submissions/${submissionId}?error=Please+complete+the+review+form`);
  }

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    select: { id: true, status: true },
  });

  if (!submission) {
    redirect("/dashboard/reviewer?error=Submission+not+found");
  }

  if (submission.status !== SubmissionStatus.UNDER_REVIEW) {
    redirect(`/submissions/${submissionId}?error=Submission+is+not+under+review`);
  }

  const assignedReviewerId = await getSubmissionReviewer(submissionId);
  if (!assignedReviewerId || assignedReviewerId !== reviewer.id) {
    redirect(`/submissions/${submissionId}?error=You+are+not+assigned+to+this+submission`);
  }

  const existing = await prisma.review.findFirst({
    where: {
      submissionId,
      reviewerId: reviewer.id,
    },
    select: { id: true },
  });

  if (existing) {
    redirect(`/submissions/${submissionId}?error=You+already+reviewed+this+submission`);
  }

  await prisma.review.create({
    data: {
      submissionId,
      reviewerId: reviewer.id,
      decision,
      comment,
    },
  });

  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status:
        decision === ReviewDecision.ACCEPT
          ? SubmissionStatus.ACCEPTED
          : SubmissionStatus.REJECTED,
    },
  });

  await clearSubmissionReviewer(submissionId);

  revalidatePath(`/submissions/${submissionId}`);
  revalidatePath("/dashboard/reviewer");
  revalidatePath("/");
}
