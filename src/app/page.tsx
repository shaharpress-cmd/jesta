"use client";

import { useMemo, useState, useRef } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Header } from "@/components/Header";
import { CategoryPills } from "@/components/CategoryPills";
import { JestaCard } from "@/components/JestaCard";
import { RadiusFilter } from "@/components/RadiusFilter";
import { SafetyBanner } from "@/components/SafetyBanner";
import { HomeHero } from "@/components/HomeHero";
import { EmptyState, PageFrame } from "@/components/EmptyState";
import { FeedSkeleton } from "@/components/FeedSkeleton";
import { SessionModeChip } from "@/components/SessionModeChip";
import { useStore } from "@/lib/store";
import { RADIUS_OPTIONS } from "@/lib/categories";
import { exampleLocationChip } from "@/lib/location";
import type { CategoryId } from "@/lib/types";

export default function HomePage() {
  const {
    filteredJestas,
    getUser,
    radius,
    setRadius,
    storeReady,
    cloudReady,
    isLoggedIn,
  } = useStore();
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const list = useMemo(() => {
    return filteredJestas.filter((j) => {
      if (category !== "all" && j.category !== category) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return (
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.locationLabel.toLowerCase().includes(q)
      );
    });
  }, [filteredJestas, category, query]);

  const radiusLabel = RADIUS_OPTIONS.find((r) => r.id === radius)?.label;
  const locationLabel = exampleLocationChip({
    guest: !isLoggedIn,
    radiusLabel,
  });

  return (
    <PageFrame>
      <Header
        variant="home"
        location={locationLabel}
        onSearchClick={() => {
          setSearchOpen(true);
          setTimeout(() => searchRef.current?.focus(), 50);
        }}
      />

      <HomeHero />

      <div className="filter-frost page-pad">
        <div className="mb-2.5 flex justify-center sm:justify-start">
          <SessionModeChip />
        </div>
        {(searchOpen || query) && (
          <div className="relative max-w-xl mb-2.5 anim-enter">
            <Search className="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-light" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => {
                if (!query.trim()) setSearchOpen(false);
              }}
              placeholder="חפש ג׳סטה..."
              className="input-soft w-full py-3.5 ps-4 pe-11 min-h-12"
            />
          </div>
        )}
        <RadiusFilter value={radius} onChange={setRadius} />
        <div className="mt-2">
          <CategoryPills selected={category} onSelect={setCategory} compact />
        </div>
      </div>

      <div className="page-pad flex flex-col gap-6 pt-6 pb-2">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-[1.4rem] sm:text-[1.65rem] font-black text-charcoal leading-none tracking-tight">
            לידך עכשיו
          </h2>
          <span className="inline-flex items-center rounded-full bg-coral-soft px-3 py-1.5 text-[13px] font-bold text-coral tabular-nums">
            {storeReady ? `${list.length} ג׳סטות` : "…"}
          </span>
        </div>

        {!storeReady ? (
          <FeedSkeleton cards={4} />
        ) : (
          <div className={list.length === 0 ? "feed-grid feed-sparse" : "feed-grid"}>
            {list.length === 0 ? (
              <EmptyState
                emoji="🤝"
                title="אין ג׳סטות בטווח הזה"
                body="נסו להרחיב את הרדיוס או לשנות קטגוריה — או פרסמו את הראשונה."
                primaryHref="/create"
                primaryLabel="פרסמו ג׳סטה"
                secondaryHref="/nearby"
                secondaryLabel="לידך"
                buddyVariant="cheer"
                buddyCategory={category === "all" ? "brand" : category}
              />
            ) : (
              list.map((j) => (
                <JestaCard key={j.id} jesta={j} author={getUser(j.authorId)} />
              ))
            )}
          </div>
        )}

        <div className="flex justify-center pt-1">
          <Link
            href="/טיפים"
            className="btn-pressable inline-flex min-h-11 items-center gap-1.5 rounded-full border border-charcoal/[0.08] bg-white px-4 py-2 text-sm font-semibold text-coral shadow-sm"
          >
            טיפים
            <span className="text-charcoal-muted font-medium">· מדריכים קצרים</span>
          </Link>
        </div>

        <SafetyBanner variant="footer" className="justify-center px-2 py-4" />
      </div>
    </PageFrame>
  );
}
