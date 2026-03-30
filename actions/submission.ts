"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Role, SubmissionStatus } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { setSubmissionReviewer } from "@/lib/reviewer-assignment";

export async function createSubmissionAction(formData: FormData): Promise<void> {
  const user = await requireUser([Role.AUTHOR]);
  const title = String(formData.get("title") || "").trim();
  const abstract = String(formData.get("abstract") || "").trim();
  const fileUrl = String(formData.get("fileUrl") || "").trim();

  if (!title || !abstract || !fileUrl) {
    redirect("/submissions/new?error=All+fields+are+required");
  }

  await prisma.submission.create({
    data: {
      title,
      abstract,
      fileUrl,
      authorId: user.id,
      status: SubmissionStatus.SUBMITTED,
    },
  });

  revalidatePath("/");
  redirect("/dashboard/author");
}

export async function assignSubmissionAction(formData: FormData): Promise<void> {
  await requireUser([Role.ADMIN]);
  const submissionId = String(formData.get("submissionId") || "");
  const reviewerId = String(formData.get("reviewerId") || "");

  if (!submissionId || !reviewerId) {
    return;
  }

  const reviewer = await prisma.user.findUnique({
    where: { id: reviewerId },
    select: { id: true, role: true },
  });

  if (!reviewer || reviewer.role !== Role.REVIEWER) {
    redirect(`/submissions/${submissionId}?error=Invalid+reviewer+selected`);
  }

  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: SubmissionStatus.UNDER_REVIEW,
    },
  });

  await setSubmissionReviewer(submissionId, reviewerId);

  revalidatePath(`/submissions/${submissionId}`);
  revalidatePath("/dashboard/reviewer");
}
