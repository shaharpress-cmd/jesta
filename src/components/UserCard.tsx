"use client";

import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { formatDistance } from "@/lib/categories";
import type { User } from "@/lib/types";
import { Avatar } from "./Avatar";

export function UserCard({
  user,
  example,
}: {
  user: User;
  /** Force example badge (e.g. helpers-tab seed fallback) */
  example?: boolean;
}) {
  const showExample = example || user.isExample;

  return (
    <Link
      href={`/profile?u=${user.id}`}
      className="flex items-center gap-3.5 card-soft card-lift p-4 anim-enter focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/30"
    >
      <Avatar
        src={user.avatar}
        name={user.name}
        size="md"
        online={user.online}
        verified={user.verified}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-charcoal truncate flex items-center gap-1.5">
            <span className="truncate">{user.name}</span>
            {showExample && (
              <span className="shrink-0 rounded-full border border-amber-700/20 bg-amberSoft/90 px-1.5 py-0.5 text-[10px] font-bold text-charcoal/75">
                דוגמה
              </span>
            )}
          </h3>
          <span className="flex items-center gap-0.5 text-xs font-medium text-charcoal shrink-0">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {user.rating.toFixed(1)}
          </span>
        </div>
        <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-charcoal-muted">
          <MapPin className="h-3 w-3 text-coral/80" />
          {formatDistance(user.distanceM ?? 0)} ממך
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="text-[11px] font-medium text-charcoal-muted">
            {user.stats.given} ג׳סטות החודש
          </span>
          {user.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded-full bg-cream px-2 py-0.5 text-[11px] font-medium text-charcoal-muted border border-charcoal/[0.06]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
