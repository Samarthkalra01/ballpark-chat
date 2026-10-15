"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { ToastProvider } from "@/components/ui/toast";

export function AppShell({
  userName,
  userSubtitle,
  children,
}: {
  userName: string;
  userSubtitle: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Sidebar
          userName={userName}
          userSubtitle={userSubtitle}
          isOpenMobile={mobileOpen}
          setIsOpenMobile={setMobileOpen}
        />
        <div className="flex min-w-0 flex-1 flex-col lg:pl-[280px]">
          <Header onOpenMobileSidebar={() => setMobileOpen(true)} />
          <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
          <footer className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-400 md:px-8">
            Your answers are saved to show your history and are sent to Google&apos;s Gemini API
            for evaluation.
          </footer>
        </div>
      </div>
    </ToastProvider>
  );
}
