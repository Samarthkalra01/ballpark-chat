"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function UpgradeButton({
  className,
  label = "Upgrade to Pro",
}: {
  className?: string;
  label?: string;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function go() {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        toast(data.error || "Couldn't start checkout. Please try again.", "error");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      toast("Network error — please try again.", "error");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={go}
      disabled={loading}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50",
        className,
      )}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          {label}
        </>
      )}
    </button>
  );
}
