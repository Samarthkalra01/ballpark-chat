import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { RESOURCES, getArticle } from "@/content/resources";

export function generateStaticParams() {
  return RESOURCES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  return { title: article ? article.title : "Resource" };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-16">
      <Link
        href="/resources"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Resources
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{article.title}</h1>
        <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          {article.readTime}
        </p>

        <div
          className="mt-8 space-y-4 text-sm leading-relaxed text-slate-600 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-800 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_strong]:text-slate-800 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-slate-200 [&_td]:p-2.5 [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:p-2.5 [&_th]:text-left [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6"
          // Trusted static content authored in src/content/resources.ts (not user input).
          dangerouslySetInnerHTML={{ __html: article.html }}
        />

        <div className="mt-10 flex items-center justify-between gap-4 rounded-2xl bg-indigo-50 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-900">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            Ready to try it?
          </div>
          <Link
            href={`/solve?category=${article.practiceCategory}`}
            className="shrink-0 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
          >
            Practise this now
          </Link>
        </div>
      </div>
    </div>
  );
}
