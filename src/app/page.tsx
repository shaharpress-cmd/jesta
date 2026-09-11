"use client";

import { useMemo, useState, useRef } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Header } from "@/components/Header";
import { CategoryPills } from "@/components/CategoryPills";
import { JestaCard } from "@/components/JestaCard";
import { RadiusFilter } from "@/components/RadiusFilter";
import { SafetyBanner } from "@/components/SafetyBanner";
import { useStore } from "@/lib/store";
import type { CategoryId } from "@/lib/types";

export default function HomePage() {
  const { filteredJestas, getUser, radius, setRadius } = useStore();
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

  return (
    <div>
      <Header
        variant="home"
        location='תל אביב · 2 ק״מ'
        onSearchClick={() => {
          setSearchOpen(true);
          setTimeout(() => searchRef.current?.focus(), 50);
        }}
      />

      <div className="px-4 space-y-4">
        {(searchOpen || query) && (
          <div className="relative">
            <Search className="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-light" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => {
                if (!query.trim()) setSearchOpen(false);
              }}
              placeholder="חפש ג׳סטה..."
              className="input-soft w-full py-3.5 ps-4 pe-11"
            />
          </div>
        )}

        <RadiusFilter value={radius} onChange={setRadius} />

        <CategoryPills
          selected={category}
          onSelect={setCategory}
          compact
        />

        <div className="space-y-4 pt-1">
          {list.length === 0 ? (
            <div className="card-soft p-8 text-center">
              <p className="text-4xl mb-2">🤝</p>
              <p className="font-medium text-charcoal">אין ג׳סטות בטווח הזה</p>
              <p className="text-sm text-charcoal-muted mt-1">
                נסו להרחיב את הרדיוס או לשנות קטגוריה
              </p>
            </div>
          ) : (
            list.map((j) => (
              <JestaCard key={j.id} jesta={j} author={getUser(j.authorId)} />
            ))
          )}
        </div>

        <div className="flex justify-center pt-2">
          <Link
            href="/טיפים"
            className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/[0.08] bg-white px-4 py-2 text-sm font-semibold text-coral shadow-sm"
          >
            טיפים
            <span className="text-charcoal-light font-medium">· מדריכים לשכנים</span>
          </Link>
        </div>

        <SafetyBanner variant="footer" className="justify-center px-2 py-4" />
      </div>
    </div>
  );
}
