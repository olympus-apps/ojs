import { notFound } from "next/navigation";
import { pages } from "./frontend-pages";
import Card from "@/lib/components/Card/Card";

export default function FrontendGalleryPage() {
  if (process.env.ENABLE_FRONTEND_GALLERY !== "true") {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Frontend Gallery
      </h1>
      <p className="mt-2 text-zinc-600">Choose a page to preview:</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {pages.map((page) => (
          <Card
            key={page.name}
            title={page.title}
            link={`/frontend/${page.name}`}
          />
        ))}
      </div>
    </main>
  );
}