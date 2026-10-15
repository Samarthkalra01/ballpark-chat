"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PlusCircle } from "lucide-react";

function titleFor(pathname: string): string {
  if (pathname.startsWith("/resources")) return "Resources & Frameworks";
  if (pathname.endsWith("/result")) return "Your Feedback";
  if (/^\/solve\/[^/]+$/.test(pathname)) return "Active Practice";
  if (pathname === "/solve") return "Set up your practice";
  if (pathname.startsWith("/history")) return "Past Performance";
  return "Ballpark";
}

export function Header({ onOpenMobileSidebar }: { onOpenMobileSidebar: () => void }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 text-slate-900 md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold tracking-tight text-slate-800 md:text-xl">
          {titleFor(pathname)}
        </h1>
      </div>

      <Link
        href="/solve"
        className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98] md:text-sm"
      >
        <PlusCircle className="h-4 w-4" />
        <span>New Session</span>
      </Link>
    </header>
  );
}
