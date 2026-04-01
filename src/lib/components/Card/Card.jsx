"use client";

import Link from "next/link";

export default function Card({ title, link }) {
  return (
    <Link
      href={link}
      className="block rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow"
    >
      <span className="font-medium">{title}</span>
    </Link>
  );
}