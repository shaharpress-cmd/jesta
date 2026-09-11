"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";

const MARKS = ["🤝", "📍", "✨"] as const;

export function HomeHero() {
  const { isLoggedIn, cloudReady } = useStore();
  const loggedIn = cloudReady && isLoggedIn;
  const waiting = !cloudReady;

  return (
    <section
      className={
        waiting
          ? "hero-band hero-band-soft page-pad"
          : loggedIn
            ? "hero-band hero-band-soft page-pad"
            : "hero-band page-pad"
      }
      aria-label={
        waiting ? "טוען" : loggedIn ? "ג׳סטה לידך" : "היכרות עם ג׳סטה"
      }
      aria-busy={waiting || undefined}
    >
      <div className="hero-blobs" aria-hidden>
        <span className="hero-blob hero-blob-a" />
        <span className="hero-blob hero-blob-b" />
        <span className="hero-blob hero-blob-c" />
      </div>

      <div className="relative z-[1] flex flex-col gap-4 sm:gap-5">
        <div className="flex items-center gap-2" aria-hidden>
          {MARKS.map((m) => (
            <span key={m} className="hero-mark">
              {m}
            </span>
          ))}
        </div>

        {waiting ? (
          <div className="space-y-3">
            <div className="h-9 w-[70%] max-w-sm rounded-xl bg-white/50 animate-pulse" />
            <div className="h-4 w-48 rounded-lg bg-white/40 animate-pulse" />
            <div className="flex gap-2.5 pt-1">
              <div className="h-12 w-32 rounded-full bg-white/55 animate-pulse" />
              <div className="h-12 w-24 rounded-full bg-white/40 animate-pulse" />
            </div>
          </div>
        ) : loggedIn ? (
          <>
            <div className="space-y-2">
              <h1 className="hero-headline">עזרה בין אנשים, לידך</h1>
              <p className="hero-sub">
                מי שצריך ג׳סטה ↔ מי שרוצה לתת
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link href="/create" className="hero-cta-primary">
                פרסמו ג׳סטה
              </Link>
              <Link href="/nearby" className="hero-cta-secondary">
                לידך
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <h1 className="hero-headline">
                מי שצריך ג׳סטה,
                <br className="sm:hidden" /> ומי שרוצה לתת
              </h1>
              <p className="hero-sub">
                עזרה בין אנשים לפי מיקום — באזור שלך
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link href="/about#how" className="hero-cta-primary">
                איך זה עובד
              </Link>
              <Link href="/login" className="hero-cta-secondary">
                התחברות
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
