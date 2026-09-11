"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useStore } from "@/lib/store";

const STORAGE_KEY = "jesta-intro-dismissed";

export function GuestIntroCard() {
  const { isLoggedIn, cloudReady } = useStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!cloudReady) return;
    if (isLoggedIn) {
      setVisible(false);
      return;
    }
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        setVisible(false);
        return;
      }
    } catch {
      /* ignore */
    }
    setVisible(true);
  }, [isLoggedIn, cloudReady]);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (!visible) return null;

  return (
    <section
      className="card-soft relative overflow-hidden p-4 sm:p-5"
      aria-label="היכרות עם ג׳סטה"
    >
      <button
        type="button"
        onClick={dismiss}
        className="absolute top-3 start-3 flex h-10 w-10 items-center justify-center rounded-full text-charcoal-light hover:bg-cream-deep hover:text-charcoal transition touch-manipulation"
        aria-label="סגור היכרות"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="pe-8 space-y-3">
        <p className="text-[15px] sm:text-base font-semibold text-charcoal leading-relaxed">
          ג׳סטה מחברת שכנים לעזרה לפי מיקום — בחינם, בלי תשלומים באפליקציה, וניתן
          להתקין כ־PWA.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/about#how"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-coral px-4 py-2 text-sm font-bold text-white shadow-soft touch-manipulation"
          >
            איך זה עובד
          </Link>
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-coral/35 bg-white px-4 py-2 text-sm font-bold text-coral touch-manipulation"
          >
            התחברות
          </Link>
        </div>
      </div>
    </section>
  );
}
