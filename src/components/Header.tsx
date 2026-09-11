"use client";

import Link from "next/link";
import { Bell, Menu, ArrowRight, MapPin } from "lucide-react";

export function Header({
  title,
  subtitle,
  showBack,
  backHref = "/",
  location,
  showMenu = false,
  showBell = true,
}: {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
  location?: string;
  showMenu?: boolean;
  showBell?: boolean;
}) {
  // Titled pages: centered title with back/actions in side slots
  if (title) {
    return (
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md px-4 pt-3.5 pb-2.5">
        <div className="relative flex items-center justify-between gap-2 min-h-9">
          <div className="flex items-center gap-1 min-w-[40px]">
            {showBack ? (
              <Link
                href={backHref}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-white/80"
                aria-label="חזרה"
              >
                <ArrowRight className="h-5 w-5 text-charcoal" />
              </Link>
            ) : (
              <span className="w-9" />
            )}
          </div>

          <h1 className="absolute inset-x-12 text-center text-lg font-bold text-charcoal truncate pointer-events-none">
            {title}
          </h1>

          <div className="flex items-center justify-end gap-0.5 min-w-[40px]">
            {showBell && (
              <button
                type="button"
                className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/80"
                aria-label="התראות"
              >
                <Bell className="h-5 w-5 text-charcoal" />
                <span className="absolute top-1.5 start-1.5 h-2 w-2 rounded-full bg-coral ring-2 ring-cream" />
              </button>
            )}
            {showMenu && (
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal-muted/70 hover:bg-white/80"
                aria-label="תפריט"
              >
                <Menu className="h-[18px] w-[18px]" />
              </button>
            )}
            {!showBell && !showMenu && <span className="w-9" />}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md px-4 pt-3.5 pb-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {showBack && (
            <Link
              href={backHref}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-white/80"
              aria-label="חזרה"
            >
              <ArrowRight className="h-5 w-5 text-charcoal" />
            </Link>
          )}

          <Link href="/" className="inline-flex flex-col items-start min-w-0">
            <span className="relative text-[1.65rem] font-black tracking-tight text-coral leading-none">
              ג׳סטה
              <span
                aria-hidden
                className="absolute -top-0.5 end-[0.15em] h-1.5 w-1.5 rounded-full bg-coral/80"
              />
            </span>
            {subtitle && (
              <p className="text-[11px] text-charcoal-muted mt-0.5 font-medium">
                {subtitle}
              </p>
            )}
          </Link>

          {location && (
            <span className="ms-1 inline-flex items-center gap-1 rounded-full bg-white/90 border border-charcoal/8 px-2.5 py-1 text-[11px] font-medium text-charcoal shadow-sm shrink-0">
              <MapPin className="h-3 w-3 text-coral shrink-0" />
              {location}
            </span>
          )}
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          {showBell && (
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/80"
              aria-label="התראות"
            >
              <Bell className="h-5 w-5 text-charcoal" />
              <span className="absolute top-1.5 start-1.5 h-2 w-2 rounded-full bg-coral ring-2 ring-cream" />
            </button>
          )}
          {showMenu && (
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal-muted/70 hover:bg-white/80 hover:text-charcoal"
              aria-label="תפריט"
            >
              <Menu className="h-[18px] w-[18px]" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
