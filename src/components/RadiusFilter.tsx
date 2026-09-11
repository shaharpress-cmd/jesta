"use client";

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
    <div className="flex min-h-11 gap-2 overflow-x-auto scrollbar-hide py-0.5 -mx-1 px-1">
      {RADIUS_OPTIONS.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "shrink-0 px-3.5 py-2 text-sm transition-colors duration-200",
              active ? "pill-active" : "pill-inactive"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
