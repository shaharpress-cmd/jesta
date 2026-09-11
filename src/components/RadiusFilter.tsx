"use client";

import { RADIUS_OPTIONS } from "@/lib/categories";
import type { RadiusPreset } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChipRail } from "@/components/ChipRail";

export function RadiusFilter({
  value,
  onChange,
}: {
  value: RadiusPreset;
  onChange: (v: RadiusPreset) => void;
}) {
  return (
    <ChipRail selectedKey={value}>
      {RADIUS_OPTIONS.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            data-chip-active={active ? "true" : undefined}
            onClick={() => onChange(opt.id)}
            className={cn(active ? "chip-active" : "chip-inactive")}
          >
            {opt.label}
          </button>
        );
      })}
    </ChipRail>
  );
}
