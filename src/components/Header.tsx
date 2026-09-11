"use client";

import { useCallback, useState, type ReactNode } from "react";
import Link from "next/link";
import { Bell, Menu, ArrowRight, Search } from "lucide-react";
import { AppMenu } from "@/components/AppMenu";
import { Wordmark } from "@/components/Wordmark";

export function Header({
  title,
  subtitle,
  showBack,
  backHref = "/",
  location,
  showMenu = false,
  showBell = true,
  variant = "default",
  onSearchClick,
}: {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
  location?: string;
  showMenu?: boolean;
  showBell?: boolean;
  /** Home: centered Latin wordmark + Hebrew wink, search + menu */
  variant?: "default" | "home";
  onSearchClick?: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const menuButton = (compact = false) => (
    <button
      type="button"
      onClick={openMenu}
      className={
        compact
          ? "flex h-10 w-10 items-center justify-center rounded-full text-charcoal-muted/70 hover:bg-white/70 hover:text-charcoal touch-manipulation"
          : "flex h-10 w-10 items-center justify-center rounded-full text-charcoal-muted/80 hover:bg-white/70 transition-colors touch-manipulation"
      }
      aria-label="תפריט"
      aria-expanded={menuOpen}
      aria-controls="app-menu"
    >
      <Menu className={compact ? "h-[18px] w-[18px]" : "h-5 w-5"} strokeWidth={2} />
    </button>
  );

  let chrome: ReactNode;

  if (variant === "home") {
    chrome = (
      <header className="app-header sticky top-0 z-40 bg-cream/95 backdrop-blur-md px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-14 items-center justify-between max-w-6xl mx-auto w-full">
          <button
            type="button"
            onClick={onSearchClick}
            className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal-muted hover:bg-white/70 transition-colors touch-manipulation"
            aria-label="חיפוש"
          >
            <Search className="h-5 w-5" strokeWidth={2} />
          </button>

          <Link
            href="/"
            className="absolute inset-x-14 flex flex-col items-center justify-center pointer-events-auto"
          >
            <Wordmark size="md" bilingual bilingualPlacement="beside" />
            {location && (
              <span className="mt-0.5 text-[11px] sm:text-xs font-medium text-charcoal-muted truncate max-w-full">
                {location}
              </span>
            )}
            {subtitle && !location && (
              <span className="mt-0.5 text-[11px] sm:text-xs font-medium text-charcoal-muted">
                {subtitle}
              </span>
            )}
          </Link>

          {menuButton(false)}
        </div>
      </header>
    );
  } else if (title) {
    chrome = (
      <header className="app-header sticky top-0 z-40 bg-cream/95 backdrop-blur-md px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-14 items-center justify-between gap-2 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-1 min-w-[40px]">
            {showBack ? (
              <Link
                href={backHref}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-white/70 touch-manipulation"
                aria-label="חזרה"
              >
                <ArrowRight className="h-5 w-5 text-charcoal" />
              </Link>
            ) : (
              <span className="w-10" />
            )}
          </div>

          <h1 className="absolute inset-x-12 text-center text-lg sm:text-xl font-bold text-charcoal truncate pointer-events-none">
            {title}
          </h1>

          <div className="flex items-center justify-end gap-0.5 min-w-[40px]">
            {showBell && (
              <button
                type="button"
                className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/70 touch-manipulation"
                aria-label="התראות"
              >
                <Bell className="h-5 w-5 text-charcoal-muted" />
                <span className="absolute top-1.5 start-1.5 h-2 w-2 rounded-full bg-coral ring-2 ring-cream" />
              </button>
            )}
            {showMenu && menuButton(true)}
            {!showBell && !showMenu && <span className="w-10" />}
          </div>
        </div>
      </header>
    );
  } else {
    chrome = (
      <header className="app-header sticky top-0 z-40 bg-cream/95 backdrop-blur-md px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-2 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {showBack && (
              <Link
                href={backHref}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-white/70 touch-manipulation"
                aria-label="חזרה"
              >
                <ArrowRight className="h-5 w-5 text-charcoal" />
              </Link>
            )}

            <Link href="/" className="inline-flex flex-col items-start min-w-0">
              <Wordmark size="md" />
              {subtitle && (
                <p className="text-[11px] sm:text-xs text-charcoal-muted mt-0.5 font-medium">
                  {subtitle}
                </p>
              )}
            </Link>

            {location && (
              <span className="ms-1 inline-flex items-center gap-1 rounded-full bg-white/90 border border-charcoal/[0.06] px-2.5 py-1 text-[11px] font-medium text-charcoal-muted shrink-0">
                {location}
              </span>
            )}
          </div>

          <div className="flex items-center gap-0.5 shrink-0">
            {showBell && (
              <button
                type="button"
                className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/70 touch-manipulation"
                aria-label="התראות"
              >
                <Bell className="h-5 w-5 text-charcoal-muted" />
                <span className="absolute top-1.5 start-1.5 h-2 w-2 rounded-full bg-coral ring-2 ring-cream" />
              </button>
            )}
            {showMenu && menuButton(true)}
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      {chrome}
      <AppMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
