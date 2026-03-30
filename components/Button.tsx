import { ReactNode } from "react";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  children: ReactNode;
};

export default function Button({ type = "submit", children }: ButtonProps) {
  return (
    <button type={type} className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700">
      {children}
    </button>
  );
}
