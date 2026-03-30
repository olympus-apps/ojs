import Link from "next/link";
import Button from "@/components/Button";
import Form from "@/components/Form";
import Input from "@/components/Input";
import { loginAction } from "@/actions/auth";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      {error ? <p className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <Form title="Login" description="Use your account to access your dashboard." action={loginAction}>
        <Input label="Email" name="email" type="email" required />
        <Input label="Password" name="password" type="password" required />
        <Button>Login</Button>
      </Form>
      <p className="mt-4 text-center text-sm text-zinc-700">
        No account yet? <Link href="/register" className="underline">Register</Link>
      </p>
    </main>
  );
}
