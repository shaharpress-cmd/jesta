"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Chip clarifying demo/local vs real Google session. */
export function SessionModeChip({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { storeReady, isLoggedIn, isCloud, currentUser } = useStore();

  if (!storeReady) return null;

  if (!isLoggedIn) {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-2 text-[12px]",
          className
        )}
      >
        <span className="inline-flex items-center rounded-full border border-charcoal/[0.08] bg-white/90 px-2.5 py-1 font-semibold text-charcoal/80">
          אורח/ת
        </span>
        {!compact && (
          <Link
            href="/login"
            className="font-bold text-coral underline-offset-2 hover:underline touch-manipulation"
          >
            התחברות
          </Link>
        )}
      </div>
    );
  }

  const isDemo =
    !isCloud ||
    currentUser.authProvider === "demo" ||
    currentUser.authProvider === "google-stub";

  if (isDemo) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-amber-700/15 bg-amberSoft/80 px-2.5 py-1 text-[12px] font-bold text-charcoal/85",
          className
        )}
        role="status"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-600/70" aria-hidden />
        מצב הדגמה
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-sage/30 bg-sage-soft/80 px-2.5 py-1 text-[12px] font-semibold text-charcoal/85",
        className
      )}
      role="status"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-sage" aria-hidden />
      {compact ? "חשבון Google" : `מחובר/ת · ${currentUser.name}`}
    </div>
  );
}
