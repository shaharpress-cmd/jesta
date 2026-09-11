"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export function MapPlaceholder({
  label = "תל אביב - יפו",
  pins = 4,
  className,
  showRadius = true,
}: {
  label?: string;
  pins?: number;
  className?: string;
  showRadius?: boolean;
}) {
  const positions = [
    { top: "35%", right: "40%" },
    { top: "50%", right: "55%" },
    { top: "42%", right: "28%" },
    { top: "60%", right: "45%" },
    { top: "30%", right: "60%" },
  ];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-gradient-to-br from-sage-soft via-sage-mist to-[#C5D9CE] border border-charcoal/[0.04]",
        className
      )}
    >
      <div className="absolute inset-0 opacity-35">
        <div className="absolute top-[30%] left-0 right-0 h-px bg-white/80 rotate-[-8deg]" />
        <div className="absolute top-[55%] left-0 right-0 h-px bg-white/80 rotate-[4deg]" />
        <div className="absolute top-0 bottom-0 right-[35%] w-px bg-white/70" />
        <div className="absolute top-0 bottom-0 right-[60%] w-px bg-white/60 rotate-3" />
        <div className="absolute top-[20%] right-[20%] text-[10px] text-charcoal/35 font-medium">
          הצפון הישן
        </div>
        <div className="absolute bottom-[25%] left-[15%] text-[10px] text-charcoal/35 font-medium">
          רמת אביב
        </div>
      </div>

      {showRadius && (
        <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full border-2 border-coral/25 bg-coral/8" />
      )}

      {positions.slice(0, pins).map((pos, i) => (
        <MapPin
          key={i}
          className="absolute h-6 w-6 text-coral fill-coral drop-shadow-sm"
          style={pos}
        />
      ))}

      <div className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-charcoal border border-charcoal/[0.05]">
        {label}
      </div>
    </div>
  );
}
