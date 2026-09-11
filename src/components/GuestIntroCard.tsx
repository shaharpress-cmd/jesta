"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "jesta-intro-dismissed";

export function GuestIntroCard() {
  const { isLoggedIn, cloudReady } = useStore();
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(false);

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

  useEffect(() => {
    if (visible) {
      setShown(true);
      return;
    }
    const t = window.setTimeout(() => setShown(false), 300);
    return () => window.clearTimeout(t);
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (!shown) return null;

  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
        visible
          ? "grid-rows-[1fr] opacity-100"
          : "grid-rows-[0fr] opacity-0 pointer-events-none"
      )}
    >
      <div className="overflow-hidden">
        <section
          className="card-soft relative overflow-hidden p-4 sm:p-5 anim-enter"
          aria-label="היכרות עם ג׳סטה"
          aria-hidden={!visible}
        >
          <button
            type="button"
            onClick={dismiss}
            className="hit absolute top-2 end-2 !h-11 !w-11"
            aria-label="סגור היכרות"
            tabIndex={visible ? 0 : -1}
          >
            <X className="h-4 w-4" />
          </button>

          <div className="pe-10 space-y-3">
            <p className="text-[15px] sm:text-base font-semibold text-charcoal leading-relaxed">
              מי שצריך ג׳סטה ומי שרוצה לתת — עזרה בין אנשים לפי מיקום, באזור שלך.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/about#how"
                tabIndex={visible ? 0 : -1}
                className="btn-pressable inline-flex min-h-11 items-center justify-center rounded-full bg-coral px-4 py-2 text-sm font-bold text-white shadow-soft"
              >
                איך זה עובד
              </Link>
              <Link
                href="/login"
                tabIndex={visible ? 0 : -1}
                className="btn-pressable inline-flex min-h-11 items-center justify-center rounded-full border border-coral/35 bg-white px-4 py-2 text-sm font-bold text-coral"
              >
                התחברות
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
