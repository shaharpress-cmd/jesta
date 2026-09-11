"use client";

import Link from "next/link";
import { MapPin, Clock, Star } from "lucide-react";
import { CATEGORY_MAP, formatDistance, formatRelativeTime } from "@/lib/categories";
import type { Jesta, User } from "@/lib/types";
import { Avatar } from "./Avatar";

export function JestaCard({
  jesta,
  author,
}: {
  jesta: Jesta;
  author?: User;
}) {
  const cat = CATEGORY_MAP[jesta.category];

  return (
    <Link
      href={`/jesta/${jesta.id}`}
      className="block card-soft card-lift p-5 anim-enter focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/30"
    >
      <div className="mb-2.5">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ backgroundColor: `${cat.color}18`, color: cat.color }}
        >
          <span className="text-[12px] leading-none">{cat.emoji}</span>
          {cat.shortLabel}
        </span>
      </div>

      <h3 className="text-[16px] font-bold text-charcoal leading-snug line-clamp-2">
        {jesta.title}
      </h3>

      <div className="mt-4 flex items-center gap-2.5">
        {author && (
          <Avatar src={author.avatar} name={author.name} size="sm" online={author.online} />
        )}
        <div className="min-w-0 flex-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-charcoal-muted">
          <span className="font-semibold text-charcoal/85 truncate">
            {author?.name ?? "משתמש"}
          </span>
          {author && (
            <span className="inline-flex items-center gap-0.5 shrink-0">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="font-medium text-charcoal/80">
                {author.rating.toFixed(1)}
              </span>
            </span>
          )}
          <span className="inline-flex items-center gap-0.5 shrink-0">
            <MapPin className="h-3 w-3 text-coral/80" />
            {formatDistance(jesta.distanceM)}
          </span>
          <span className="inline-flex items-center gap-0.5 shrink-0">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(jesta.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
