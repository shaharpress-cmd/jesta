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
    <nav className="fixed bottom-0 inset-x-0 z-50 mx-auto max-w-md border-t border-charcoal/5 bg-white/95 backdrop-blur-md shadow-nav pb-safe">
      <div className="flex items-end justify-around px-1 pt-1.5 pb-2.5">
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
                className="relative -mt-7 flex flex-col items-center px-1"
              >
                <span className="flex h-[3.6rem] w-[3.6rem] items-center justify-center rounded-full bg-coral shadow-soft text-white ring-4 ring-cream">
                  <Icon className="h-7 w-7" strokeWidth={2.75} />
                </span>
                <span className="mt-1 text-[10px] font-bold text-coral">
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
                "relative flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] transition-colors",
                active
                  ? "font-bold text-coral"
                  : "font-medium text-charcoal-muted"
              )}
            >
              <span className="relative">
                <Icon
                  className={cn("h-6 w-6", active && "stroke-[2.5]")}
                />
                {tab.href === "/messages" && unread > 0 && (
                  <span className="absolute -top-1 -start-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </span>
              {tab.label}
              {active && (
                <span className="absolute -bottom-0.5 h-0.5 w-5 rounded-full bg-coral" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
