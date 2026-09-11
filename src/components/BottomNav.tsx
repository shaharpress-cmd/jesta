"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPinned, Plus, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

const tabs = [
  { href: "/", label: "בית", icon: Home },
  { href: "/nearby", label: "לידך", icon: MapPinned },
  { href: "/create", label: "פרסם", icon: Plus, special: true },
  { href: "/messages", label: "הודעות", icon: MessageCircle },
  { href: "/profile", label: "פרופיל", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { threads } = useStore();
  const unread = threads.reduce((s, t) => s + t.unreadCount, 0);

  const hide =
    pathname.startsWith("/chat/") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/create") ||
    pathname.startsWith("/jesta/");

  if (hide) return null;

  return (
    <nav className="app-bottom-nav fixed bottom-0 inset-x-0 z-50 mx-auto w-full max-w-md sm:max-w-xl md:max-w-3xl lg:bottom-5 lg:max-w-lg lg:rounded-[1.75rem] lg:border lg:border-charcoal/[0.07] border-t border-charcoal/[0.05] bg-white/95 backdrop-blur-md shadow-nav lg:shadow-card pb-safe lg:pb-2">
      <div className="flex h-[3.75rem] lg:h-16 items-end justify-around px-1 sm:px-4 lg:px-5 pt-1.5 pb-2 lg:items-center">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          if (tab.special) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="nav-fab"
                aria-label={tab.label}
              >
                <span className="nav-fab-orb">
                  <Icon className="h-7 w-7 lg:h-5 lg:w-5" strokeWidth={2.5} />
                </span>
                <span className="mt-1 text-[10px] sm:text-[11px] font-semibold text-coral lg:hidden">
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "nav-tab",
                active
                  ? "font-bold text-coral"
                  : "font-medium text-charcoal-muted"
              )}
              aria-current={active ? "page" : undefined}
            >
              <span className="relative">
                <Icon
                  className={cn("h-6 w-6 lg:h-5 lg:w-5", active && "stroke-[2.4]")}
                  fill={active && tab.href === "/nearby" ? "currentColor" : "none"}
                />
                {tab.href === "/messages" && unread > 0 && (
                  <span className="absolute -top-1 -start-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[9px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </span>
              {tab.label}
              {active && (
                <span
                  className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-coral lg:hidden"
                  aria-hidden
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
