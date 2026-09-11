"use client";

import Link from "next/link";
import { MapPin, Clock, MessageCircle } from "lucide-react";
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
      className="block rounded-2xl bg-white p-5 shadow-card transition hover:shadow-soft active:scale-[0.99]"
    >
      <div className="flex gap-3.5">
        <div className="flex flex-col items-center gap-1.5 pt-0.5">
          {author && (
            <Avatar src={author.avatar} name={author.name} size="md" online={author.online} />
          )}
          <span className="flex items-center gap-0.5 text-[10px] font-medium text-charcoal-muted">
            <MapPin className="h-2.5 w-2.5 text-coral" />
            {formatDistance(jesta.distanceM)}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1.5">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              style={{ backgroundColor: `${cat.color}1A`, color: cat.color }}
            >
              <span className="text-[12px] leading-none">{cat.emoji}</span>
              {cat.shortLabel}
            </span>
          </div>
          <h3 className="text-[15px] font-bold text-charcoal leading-snug line-clamp-2">
            {jesta.title}
          </h3>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-charcoal-muted">
            <span className="font-medium text-charcoal/80">{author?.name ?? "משתמש"}</span>
            <span className="text-charcoal-light">·</span>
            <Clock className="h-3 w-3 shrink-0" />
            {formatRelativeTime(jesta.createdAt)}
          </p>
        </div>

        <div className="flex flex-col items-center justify-between shrink-0 self-stretch">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full text-xl"
            style={{ backgroundColor: `${cat.color}18` }}
          >
            {cat.emoji}
          </span>
          {jesta.respondersCount > 0 && (
            <span className="mt-2 flex items-center gap-0.5 text-[10px] font-semibold text-coral">
              <MessageCircle className="h-3 w-3" />
              {jesta.respondersCount} מגיבים
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
