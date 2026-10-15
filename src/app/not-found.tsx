import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-md">
        <div className="h-5 w-5 rotate-45 rounded-sm bg-white" />
      </div>
      <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-slate-900">404</h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
        We couldn&apos;t find that page — it may have moved, or never existed.
      </p>
      <Link
        href="/resources"
        className="mt-8 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
      >
        Back to Resources
      </Link>
    </div>
  );
}
