"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Brain, BarChart3, Play, X, LogOut, Sparkles, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/(app)/actions";

const NAV = [
  { href: "/resources", label: "Resources", icon: BookOpen, badge: "Guide" },
  { href: "/solve", label: "Solve", icon: Brain, badge: "Live" },
  { href: "/history", label: "Past Performance", icon: BarChart3, badge: undefined },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/history") return pathname.startsWith("/history");
  if (href === "/solve") return pathname === "/solve" || pathname.startsWith("/solve/");
  if (href === "/resources") return pathname.startsWith("/resources");
  return pathname === href;
}

function SidebarInner({
  userName,
  userSubtitle,
  isPro,
  onNavigate,
}: {
  userName: string;
  userSubtitle: string;
  isPro: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const initial = (userName || "U").charAt(0).toUpperCase();

  return (
    <div className="flex h-full flex-col bg-slate-900 px-4 py-6 text-white">
      {/* Brand */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-md">
          <div className="h-4 w-4 rotate-45 rounded-sm bg-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight">Ballpark</span>
          <span className="text-xs text-slate-400">Consulting guesstimate practice</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all",
                active
                  ? "bg-indigo-600 font-semibold text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-800/80 hover:text-white",
              )}
              aria-current={active ? "page" : undefined}
            >
              <span className="flex items-center gap-3">
                <Icon className={cn("h-5 w-5", active ? "text-white" : "text-slate-400")} />
                {item.label}
              </span>
              {item.badge && (
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                    active ? "bg-white/20 text-white" : "bg-slate-800 text-slate-300",
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* CTA */}
      <div className="my-6 px-1">
        <Link
          href="/solve"
          onClick={onNavigate}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 font-bold text-white shadow-md transition-all hover:bg-indigo-700 active:scale-[0.98]"
        >
          <Play className="h-4 w-4 fill-current" />
          Start a guesstimate
        </Link>
      </div>

      {/* User card */}
      <div className="mb-3 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-800/70 p-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/20 text-xs font-bold text-indigo-300">
          {initial}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="flex items-center gap-1.5 truncate text-xs font-bold text-white">
            {userName}
            {isPro && (
              <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-300">
                Pro
              </span>
            )}
          </span>
          <span className="truncate text-[10px] text-slate-400">{userSubtitle}</span>
        </div>
      </div>

      {/* Billing / upgrade + logout */}
      <div className="space-y-1 border-t border-slate-800 pt-3">
        <Link
          href="/billing"
          onClick={onNavigate}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white"
        >
          {isPro ? <CreditCard className="h-4 w-4" /> : <Sparkles className="h-4 w-4 text-indigo-400" />}
          {isPro ? "Billing" : "Upgrade to Pro"}
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}

export function Sidebar({
  userName,
  userSubtitle,
  isPro,
  isOpenMobile,
  setIsOpenMobile,
}: {
  userName: string;
  userSubtitle: string;
  isPro: boolean;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}) {
  return (
    <>
      {/* Desktop persistent sidebar (280px) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] border-r border-slate-800 lg:block">
        <SidebarInner userName={userName} userSubtitle={userSubtitle} isPro={isPro} />
      </aside>

      {/* Mobile drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpenMobile(false)}
          />
          <div className="relative z-10 h-full w-[280px] shadow-2xl">
            <button
              onClick={() => setIsOpenMobile(false)}
              className="absolute right-4 top-4 rounded-lg bg-slate-800 p-1.5 text-white/70 hover:text-white"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarInner
              userName={userName}
              userSubtitle={userSubtitle}
              isPro={isPro}
              onNavigate={() => setIsOpenMobile(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
