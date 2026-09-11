"use client";

import { MapPin } from "lucide-react";
import { RADIUS_OPTIONS } from "@/lib/categories";
import type { RadiusPreset } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RadiusFilter({
  value,
  onChange,
}: {
  value: RadiusPreset;
  onChange: (v: RadiusPreset) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
      {RADIUS_OPTIONS.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition-all flex items-center gap-1.5",
              active
                ? "bg-coral text-white shadow-soft"
                : "bg-white text-charcoal border border-charcoal/10"
            )}
          >
            {active && <MapPin className="h-3.5 w-3.5" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
