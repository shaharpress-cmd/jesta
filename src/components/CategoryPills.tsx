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
    <div className="flex min-h-11 gap-2 overflow-x-auto scrollbar-hide py-0.5 -mx-1 px-1">
      {showAll && (
        <button
          type="button"
          onClick={() => onSelect("all")}
          className={cn(selected === "all" ? "chip-active" : "chip-inactive")}
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
            className={cn(active ? "chip-active" : "chip-inactive")}
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
