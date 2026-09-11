"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import {
  CircleHelp,
  Info,
  Lightbulb,
  LogIn,
  Shield,
  UserRound,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/Wordmark";

const LINKS = [
  { href: "/about", label: "מה זה ג׳סטה?", icon: Info },
  { href: "/about#how", label: "איך זה עובד", icon: CircleHelp },
  { href: "/טיפים", label: "טיפים", icon: Lightbulb },
] as const;

export function AppMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { isLoggedIn } = useStore();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [shown, setShown] = useState(open);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (open) {
      setShown(true);
      const id = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(id);
    }
    setEntered(false);
    const t = window.setTimeout(() => setShown(false), 220);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  if (!shown) return null;

  const account = isLoggedIn
    ? { href: "/profile", label: "פרופיל", icon: UserRound }
    : { href: "/login", label: "התחברות / הרשמה", icon: LogIn };

  return (
    <div className="fixed inset-0 z-[70]" role="presentation">
      <button
        type="button"
        aria-label="סגירת תפריט"
        className={cn(
          "absolute inset-0 bg-charcoal/30 backdrop-blur-[2px] transition-opacity duration-200",
          entered ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      <div
        id="app-menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-open={entered ? "true" : "false"}
        className={cn(
          "app-menu-panel absolute flex flex-col bg-cream shadow-card",
          "inset-x-0 bottom-0 max-h-[min(88dvh,40rem)] rounded-t-[2rem]",
          "md:inset-y-0 md:end-0 md:start-auto md:h-full md:max-h-none md:w-[min(22.5rem,92vw)] md:rounded-none md:rounded-s-[1.75rem]",
          entered ? "app-menu-panel-open" : ""
        )}
      >
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-charcoal/15 md:hidden" />

        <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3 md:pt-6">
          <div className="min-w-0">
            <p id={titleId} className="leading-none">
              <Wordmark size="sm" />
            </p>
            <p className="mt-1 text-[12px] font-medium text-charcoal-muted">
              עזרה בין אנשים לפי מיקום
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full text-charcoal-muted hover:bg-white/80 transition touch-manipulation"
            aria-label="סגור"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4 pt-1">
          <ul className="space-y-1">
            {LINKS.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  className="flex min-h-12 items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-semibold text-charcoal hover:bg-white/80 transition touch-manipulation"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-coral shadow-sm border border-charcoal/[0.05]">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
                  </span>
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={account.href}
                onClick={onClose}
                className="flex min-h-12 items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-semibold text-charcoal hover:bg-white/80 transition touch-manipulation"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-coral-soft text-coral shadow-sm">
                  <account.icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
                </span>
                {account.label}
              </Link>
            </li>
          </ul>

          <div className="mt-5 rounded-3xl safety-amber px-4 py-3.5">
            <p className="flex items-start gap-2 text-sm leading-relaxed text-charcoal/90">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-700/70" />
              <span>
                בטיחות: העדיפו מקום ציבורי, אל תשתפו כתובת מדויקת בהתחלה, ובחירום
                התקשרו 100/101/102. דיווח זמין מכל ג׳סטה.
              </span>
            </p>
            <Link
              href="/about#safety"
              onClick={onClose}
              className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-coral hover:underline"
            >
              בטיחות / דיווח
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
