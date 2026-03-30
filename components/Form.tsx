import { ReactNode } from "react";

type FormProps = {
  title: string;
  description?: string;
  children: ReactNode;
  action: (formData: FormData) => void | Promise<void>;
};

export default function Form({ title, description, children, action }: FormProps) {
  return (
    <form action={action} className="mx-auto w-full max-w-xl space-y-4 rounded border bg-white p-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">{title}</h1>
        {description ? <p className="mt-1 text-sm text-zinc-600">{description}</p> : null}
      </div>
      {children}
    </form>
  );
}
