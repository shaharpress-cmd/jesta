"use client";

import Link from "next/link";
import { MapPin, Clock, Star } from "lucide-react";
import {
  CATEGORY_MAP,
  formatDistance,
  formatRelativeTime,
  urgencyLabel,
} from "@/lib/categories";
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
  const urgency = urgencyLabel(jesta.urgency);

  return (
    <Link
      href={`/jesta/${jesta.id}`}
      className="jesta-card card-lift anim-enter block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/30"
      style={{
        borderInlineStartColor: cat.color,
        backgroundImage: `linear-gradient(to left, ${cat.color}14, #ffffff 42%)`,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-bold"
          style={{ backgroundColor: `${cat.color}22`, color: cat.color }}
        >
          <span className="text-[13px] leading-none">{cat.emoji}</span>
          {cat.shortLabel}
        </span>
        {urgency && (
          <span className="inline-flex items-center rounded-full bg-coral px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            {urgency}
          </span>
        )}
      </div>

      <h3 className="mt-3 text-[19px] sm:text-[20px] font-black text-charcoal leading-snug line-clamp-2 tracking-tight">
        {jesta.title}
      </h3>

      <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-medium text-charcoal-muted">
        <span className="inline-flex items-center gap-1 text-charcoal/80">
          <MapPin className="h-3.5 w-3.5 text-coral shrink-0" />
          {jesta.locationLabel}
          <span className="text-charcoal-light">·</span>
          {formatDistance(jesta.distanceM)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          {formatRelativeTime(jesta.createdAt)}
        </span>
      </p>

      <div className="mt-4 flex items-center gap-2.5 border-t border-charcoal/[0.06] pt-3">
        {author && (
          <Avatar src={author.avatar} name={author.name} size="sm" online={author.online} />
        )}
        <div className="min-w-0 flex-1 flex items-center gap-2 text-[12px] text-charcoal-muted">
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
        </div>
      </div>
    </Link>
  );
}
