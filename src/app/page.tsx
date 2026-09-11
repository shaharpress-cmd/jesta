"use client";

import { useMemo, useState } from "react";
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
      <Header location='תל אביב · 2 ק״מ' />

      <div className="px-4 space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-light" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חפש ג׳סטה..."
            className="w-full rounded-2xl border border-charcoal/8 bg-white py-3.5 ps-4 pe-10 text-sm shadow-card placeholder:text-charcoal-light focus:outline-none focus:ring-2 focus:ring-coral/40"
          />
        </div>

        <RadiusFilter value={radius} onChange={setRadius} />

        <CategoryPills
          selected={category}
          onSelect={setCategory}
          compact
        />

        <div className="space-y-3.5 pt-1">
          {list.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-card">
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

        <SafetyBanner variant="footer" className="justify-center px-2 py-4" />
      </div>
    </div>
  );
}
