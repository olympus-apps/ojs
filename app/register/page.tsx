import Link from "next/link";
import Button from "@/components/Button";
import Form from "@/components/Form";
import Input from "@/components/Input";
import { registerAction } from "@/actions/auth";

type RegisterPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      {error ? <p className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <Form title="Register" description="Create an AUTHOR or REVIEWER account." action={registerAction}>
        <Input label="Name" name="name" required />
        <Input label="Email" name="email" type="email" required />
        <Input label="Password" name="password" type="password" required />
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-800">Role</span>
          <select name="role" className="w-full rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-800 focus:ring-2">
            <option value="AUTHOR">AUTHOR</option>
            <option value="REVIEWER">REVIEWER</option>
          </select>
        </label>
        <Button>Create account</Button>
      </Form>
      <p className="mt-4 text-center text-sm text-zinc-700">
        Already have an account? <Link href="/login" className="underline">Login</Link>
      </p>
    </main>
  );
}
