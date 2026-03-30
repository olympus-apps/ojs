import Link from "next/link";
import { Role } from "@prisma/client";
import Button from "@/components/Button";
import Form from "@/components/Form";
import Input from "@/components/Input";
import { createSubmissionAction } from "@/actions/submission";
import { requireUser } from "@/lib/auth";

type NewSubmissionPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewSubmissionPage({ searchParams }: NewSubmissionPageProps) {
  await requireUser([Role.AUTHOR]);
  const { error } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      {error ? <p className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <Form title="New Submission" description="Submit your manuscript for review." action={createSubmissionAction}>
        <Input label="Title" name="title" required />

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-800">Abstract</span>
          <textarea
            name="abstract"
            required
            rows={6}
            className="w-full rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-800 focus:ring-2"
          />
        </label>

        <Input
          label="File URL"
          name="fileUrl"
          type="url"
          required
          placeholder="https://..."
        />

        <Button>Submit paper</Button>
      </Form>

      <p className="mt-4 text-center text-sm text-zinc-700">
        <Link href="/dashboard/author" className="underline">
          Back to author dashboard
        </Link>
      </p>
    </main>
  );
}
