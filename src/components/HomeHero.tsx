"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";

const MARKS = ["🤝", "📍", "✨"] as const;

export function HomeHero() {
  const { isLoggedIn, cloudReady } = useStore();
  const loggedIn = cloudReady && isLoggedIn;

  return (
    <section
      className={loggedIn ? "hero-band hero-band-soft page-pad" : "hero-band page-pad"}
      aria-label={loggedIn ? "ג׳סטה לידך" : "היכרות עם ג׳סטה"}
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

        {loggedIn ? (
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
