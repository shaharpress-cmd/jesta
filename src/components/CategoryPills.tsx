"use client";

import {
  Fuel,
  Package,
  ShoppingCart,
  Home,
  Leaf,
  Dog,
  Laptop,
  Building2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import type { CategoryId } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONS: Record<CategoryId, LucideIcon> = {
  fuel: Fuel,
  moving: Package,
  errands: ShoppingCart,
  home: Home,
  garden: Leaf,
  pets: Dog,
  digital: Laptop,
  neighborhood: Building2,
  other: Sparkles,
};

export function CategoryPills({
  selected,
  onSelect,
  showAll = true,
  compact = false,
}: {
  selected: CategoryId | "all" | null;
  onSelect: (id: CategoryId | "all") => void;
  showAll?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
      {showAll && (
        <button
          type="button"
          onClick={() => onSelect("all")}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all",
            selected === "all"
              ? "bg-coral text-white shadow-soft"
              : "bg-white text-charcoal border border-charcoal/10"
          )}
        >
          הכל
        </button>
      )}
      {CATEGORIES.map((c) => {
        const Icon = ICONS[c.id];
        const active = selected === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition-all flex items-center gap-1.5",
              active
                ? "bg-coral text-white shadow-soft"
                : "bg-white text-charcoal border border-charcoal/10"
            )}
          >
            <Icon
              className={cn("h-3.5 w-3.5", active ? "text-white" : "text-coral")}
              strokeWidth={2.25}
            />
            <span>{compact ? c.shortLabel : c.label}</span>
          </button>
        );
      })}
    </div>
  );
}
